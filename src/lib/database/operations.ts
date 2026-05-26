import { getDb } from "@/lib/firebase";
import type {
  User,
  ApiKeys,
  Automation,
  Product,
  Supplier,
  Order,
  AuditLog,
  PromptTemplate,
  Settings,
} from "./types";

// Generic CRUD operations
export async function createDocument<T extends Record<string, any>>(
  collection: string,
  data: T,
  docId?: string
): Promise<string> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  const docRef = docId ? db.collection(collection).doc(docId) : db.collection(collection).doc();
  await docRef.set(data);
  return docRef.id;
}

export async function getDocument<T>(
  collection: string,
  docId: string
): Promise<T | null> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  const doc = await db.collection(collection).doc(docId).get();
  if (!doc.exists) return null;
  return doc.data() as T;
}

export async function updateDocument<T>(
  collection: string,
  docId: string,
  data: Partial<T>
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  await db.collection(collection).doc(docId).update(data);
}

export async function deleteDocument(
  collection: string,
  docId: string
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  await db.collection(collection).doc(docId).delete();
}

export async function queryCollection<T>(
  collection: string,
  field: string,
  operator: any,
  value: any
): Promise<T[]> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  const snapshot = await db.collection(collection).where(field, operator, value).get();
  return snapshot.docs.map((doc) => doc.data() as T);
}

// User operations
export async function createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const now = new Date().toISOString();
  const userData: User = {
    ...user,
    id: "",
    createdAt: now,
    updatedAt: now,
  };
  return createDocument<User>("users", userData);
}

/** Create or update a user document keyed by Firebase Auth UID. */
export async function upsertUser(
  userId: string,
  user: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  const existing = await getDocument<User>("users", userId);
  const now = new Date().toISOString();

  await db
    .collection("users")
    .doc(userId)
    .set(
      {
        ...user,
        id: userId,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      },
      { merge: true },
    );
}

export async function getUser(userId: string): Promise<User | null> {
  return getDocument<User>("users", userId);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await queryCollection<User>("users", "email", "==", email);
  return users[0] || null;
}

// API Keys operations
export async function saveApiKeys(
  userId: string,
  apiKeys: Partial<ApiKeys>
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  const now = new Date().toISOString();
  const docRef = db.collection("api_keys").doc(userId);
  
  await docRef.set(
    {
      ...apiKeys,
      userId,
      id: userId,
      updatedAt: now,
    },
    { merge: true }
  );
}

export async function getApiKeys(userId: string): Promise<ApiKeys | null> {
  return getDocument<ApiKeys>("api_keys", userId);
}

// Automation operations
export async function createAutomation(
  automation: Omit<Automation, "id" | "createdAt">
): Promise<string> {
  const now = new Date().toISOString();
  const automationData: Automation = {
    ...automation,
    id: "",
    createdAt: now,
  };
  return createDocument<Automation>("automations", automationData);
}

export async function updateAutomation(
  automationId: string,
  updates: Partial<Automation>
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  await db.collection("automations").doc(automationId).update({
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteUserAutomations(userId: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  const snapshot = await db
    .collection("automations")
    .where("userId", "==", userId)
    .get();

  await Promise.all(
    snapshot.docs.map((doc) => doc.ref.delete().catch(() => null)),
  );
}

export async function getUserAutomations(
  userId: string,
  limit = 50
): Promise<Automation[]> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  const snapshot = await db
    .collection("automations")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as Automation);
}

// Product operations
export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const now = new Date().toISOString();
  const productData: Product = {
    ...product,
    id: "",
    createdAt: now,
    updatedAt: now,
  };
  return createDocument<Product>("products", productData);
}

export async function getUserProducts(
  userId: string,
  limit?: number,
  cursor?: string
): Promise<{ products: Product[]; cursor?: string }> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  let query = db.collection("products").where("userId", "==", userId).orderBy("createdAt", "desc");
  if (limit) query = query.limit(limit);
  const snapshot = await query.get();
  const products = snapshot.docs.map((doc) => doc.data() as Product);
  const nextCursor = snapshot.docs.length === limit ? snapshot.docs[snapshot.docs.length - 1].id : undefined;
  return { products, cursor: nextCursor };
}

export async function deleteProduct(productId: string): Promise<void> {
  return deleteDocument("products", productId);
}

// Supplier operations
export async function createSupplier(
  supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const now = new Date().toISOString();
  const supplierData: Supplier = {
    ...supplier,
    id: "",
    createdAt: now,
    updatedAt: now,
  };
  return createDocument<Supplier>("suppliers", supplierData);
}

export async function getUserSuppliers(userId: string): Promise<Supplier[]> {
  return queryCollection<Supplier>("suppliers", "userId", "==", userId);
}

export async function deleteSupplier(supplierId: string): Promise<void> {
  return deleteDocument("suppliers", supplierId);
}

// Order operations
export async function createOrder(
  order: Omit<Order, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const now = new Date().toISOString();
  const orderData: Order = {
    ...order,
    id: "",
    createdAt: now,
    updatedAt: now,
  };
  return createDocument<Order>("orders", orderData);
}

export async function updateOrder(
  orderId: string,
  updates: Partial<Order>
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  await db.collection("orders").doc(orderId).update({
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function getUserOrders(
  userId: string,
  limit?: number,
  cursor?: string
): Promise<{ orders: Order[]; cursor?: string }> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  let query = db.collection("orders").where("userId", "==", userId).orderBy("createdAt", "desc");
  if (limit) query = query.limit(limit);
  const snapshot = await query.get();
  const orders = snapshot.docs.map((doc) => doc.data() as Order);
  const nextCursor = snapshot.docs.length === limit ? snapshot.docs[snapshot.docs.length - 1].id : undefined;
  return { orders, cursor: nextCursor };
}

export async function deleteOrder(orderId: string): Promise<void> {
  return deleteDocument("orders", orderId);
}

export async function getOrder(orderId: string): Promise<Order | null> {
  return getDocument<Order>("orders", orderId);
}

export async function searchOrders(
  userId: string,
  searchText: string,
  status?: string
): Promise<Order[]> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  let query: import("firebase-admin/firestore").Query = db
    .collection("orders")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc");

  if (status && status !== "all") {
    query = query.where("status", "==", status);
  }

  const snapshot = await query.get();
  const searchLower = searchText.toLowerCase();

  return snapshot.docs
    .map((doc) => doc.data() as Order)
    .filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(searchLower)
        )
    );
}

// Audit log operations
export async function createAuditLog(
  log: Omit<AuditLog, "id" | "createdAt">
): Promise<string> {
  const db = getDb();
  if (!db) return "demo";
  const now = new Date().toISOString();
  const data: AuditLog = { id: "", createdAt: now, ...log };
  return createDocument<AuditLog>("audit_logs", data);
}

export async function getAuditLogs(
  userId: string,
  limit = 50
): Promise<AuditLog[]> {
  const db = getDb();
  if (!db) return [];

  const snapshot = await db
    .collection("audit_logs")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as AuditLog);
}

// Prompt template operations
export async function createPromptTemplate(
  template: Omit<PromptTemplate, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const db = getDb();
  if (!db) return "demo";
  const now = new Date().toISOString();
  const data: PromptTemplate = {
    id: "",
    createdAt: now,
    updatedAt: now,
    ...template,
  };
  return createDocument<PromptTemplate>("prompt_templates", data);
}

export async function getPromptTemplates(
  userId: string,
  moduleId?: string
): Promise<PromptTemplate[]> {
  const db = getDb();
  if (!db) return [];

  let q = db.collection("prompt_templates").where("userId", "==", userId);
  if (moduleId) {
    q = q.where("moduleId", "==", moduleId);
  }
  const snapshot = await q.orderBy("updatedAt", "desc").get();
  return snapshot.docs.map((doc) => doc.data() as PromptTemplate);
}

export async function updatePromptTemplate(
  id: string,
  updates: Partial<Omit<PromptTemplate, "id" | "userId" | "createdAt">>
): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db.collection("prompt_templates").doc(id).update({
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deletePromptTemplate(id: string): Promise<void> {
  return deleteDocument("prompt_templates", id);
}

// Settings operations
export async function saveSettings(
  userId: string,
  settings: Partial<Settings>
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  const now = new Date().toISOString();
  const docRef = db.collection("settings").doc(userId);
  
  await docRef.set(
    {
      ...settings,
      userId,
      id: userId,
      updatedAt: now,
    },
    { merge: true }
  );
}

export async function getSettings(userId: string): Promise<Settings | null> {
  return getDocument<Settings>("settings", userId);
}

// Notification operations
export async function createNotification(
  notification: Omit<import("./types").Notification, "id" | "createdAt">
): Promise<string> {
  const now = new Date().toISOString();
  const data: import("./types").Notification = {
    ...notification,
    id: "",
    createdAt: now,
  };
  return createDocument<import("./types").Notification>("notifications", data);
}

export async function getUserNotifications(
  userId: string,
  limit = 50,
  unreadOnly = false
): Promise<import("./types").Notification[]> {
  const db = getDb();
  if (!db) return [];

  let query = db.collection("notifications").where("userId", "==", userId);
  if (unreadOnly) query = query.where("read", "==", false);
  const snapshot = await query.orderBy("createdAt", "desc").limit(limit).get();
  return snapshot.docs.map((doc) => doc.data() as import("./types").Notification);
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  return updateDocument("notifications", notificationId, { read: true });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const db = getDb();
  if (!db) return;

  const snapshot = await db
    .collection("notifications")
    .where("userId", "==", userId)
    .where("read", "==", false)
    .get();

  await Promise.all(
    snapshot.docs.map((doc) => doc.ref.update({ read: true })),
  );
}

export async function deleteNotification(notificationId: string): Promise<void> {
  return deleteDocument("notifications", notificationId);
}

// Team operations
export async function createTeamMember(
  member: Omit<import("./types").TeamMember, "id" | "joinedAt">
): Promise<string> {
  const now = new Date().toISOString();
  const data: import("./types").TeamMember = {
    ...member,
    id: "",
    joinedAt: now,
  };
  return createDocument<import("./types").TeamMember>("team_members", data);
}

export async function getTeamMembers(userId: string): Promise<import("./types").TeamMember[]> {
  return queryCollection<import("./types").TeamMember>("team_members", "userId", "==", userId);
}

export async function updateTeamMember(
  memberId: string,
  updates: Partial<import("./types").TeamMember>
): Promise<void> {
  return updateDocument("team_members", memberId, updates);
}

export async function removeTeamMember(memberId: string): Promise<void> {
  return deleteDocument("team_members", memberId);
}

export async function createTeamInvitation(
  invitation: Omit<import("./types").TeamInvitation, "id">
): Promise<string> {
  const data: import("./types").TeamInvitation = {
    ...invitation,
    id: "",
  };
  return createDocument<import("./types").TeamInvitation>("team_invitations", data);
}

export async function getPendingInvitations(userId: string): Promise<import("./types").TeamInvitation[]> {
  const db = getDb();
  if (!db) return [];

  const snapshot = await db
    .collection("team_invitations")
    .where("invitedBy", "==", userId)
    .where("status", "==", "pending")
    .get();

  return snapshot.docs.map((doc) => doc.data() as import("./types").TeamInvitation);
}

export async function updateInvitationStatus(
  invitationId: string,
  status: import("./types").TeamInvitation["status"]
): Promise<void> {
  return updateDocument("team_invitations", invitationId, { status });
}

// Workflow operations
export async function createWorkflow(
  workflow: Omit<import("./types").Workflow, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const now = new Date().toISOString();
  const data: import("./types").Workflow = {
    ...workflow,
    id: "",
    createdAt: now,
    updatedAt: now,
  };
  return createDocument<import("./types").Workflow>("workflows", data);
}

export async function getUserWorkflows(userId: string): Promise<import("./types").Workflow[]> {
  return queryCollection<import("./types").Workflow>("workflows", "userId", "==", userId);
}

export async function getWorkflow(workflowId: string): Promise<import("./types").Workflow | null> {
  return getDocument<import("./types").Workflow>("workflows", workflowId);
}

export async function updateWorkflow(
  workflowId: string,
  updates: Partial<import("./types").Workflow>
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  await db.collection("workflows").doc(workflowId).update({
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteWorkflow(workflowId: string): Promise<void> {
  return deleteDocument("workflows", workflowId);
}

export async function createWorkflowRun(
  run: Omit<import("./types").WorkflowRun, "id">
): Promise<string> {
  const data: import("./types").WorkflowRun = {
    ...run,
    id: "",
  };
  return createDocument<import("./types").WorkflowRun>("workflow_runs", data);
}

export async function getWorkflowRuns(
  workflowId: string,
  limit = 20
): Promise<import("./types").WorkflowRun[]> {
  const db = getDb();
  if (!db) return [];

  const snapshot = await db
    .collection("workflow_runs")
    .where("workflowId", "==", workflowId)
    .orderBy("startedAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as import("./types").WorkflowRun);
}

export async function updateWorkflowRun(
  runId: string,
  updates: Partial<import("./types").WorkflowRun>
): Promise<void> {
  return updateDocument("workflow_runs", runId, updates);
}

// Webhook operations
export async function createWebhook(
  webhook: Omit<import("./types").Webhook, "id" | "createdAt">
): Promise<string> {
  const now = new Date().toISOString();
  const data: import("./types").Webhook = {
    ...webhook,
    id: "",
    createdAt: now,
  };
  return createDocument<import("./types").Webhook>("webhooks", data);
}

export async function getUserWebhooks(userId: string): Promise<import("./types").Webhook[]> {
  return queryCollection<import("./types").Webhook>("webhooks", "userId", "==", userId);
}

export async function getWebhook(webhookId: string): Promise<import("./types").Webhook | null> {
  return getDocument<import("./types").Webhook>("webhooks", webhookId);
}

export async function updateWebhook(
  webhookId: string,
  updates: Partial<import("./types").Webhook>
): Promise<void> {
  return updateDocument("webhooks", webhookId, updates);
}

export async function deleteWebhook(webhookId: string): Promise<void> {
  return deleteDocument("webhooks", webhookId);
}

export async function createWebhookDelivery(
  delivery: Omit<import("./types").WebhookDelivery, "id">
): Promise<string> {
  const data: import("./types").WebhookDelivery = {
    ...delivery,
    id: "",
  };
  return createDocument<import("./types").WebhookDelivery>("webhook_deliveries", data);
}

export async function getWebhookDeliveries(
  webhookId: string,
  limit = 50
): Promise<import("./types").WebhookDelivery[]> {
  const db = getDb();
  if (!db) return [];

  const snapshot = await db
    .collection("webhook_deliveries")
    .where("webhookId", "==", webhookId)
    .orderBy("deliveredAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as import("./types").WebhookDelivery);
}

// Analytics operations
export async function saveAnalyticsData(
  userId: string,
  data: import("./types").AnalyticsData
): Promise<void> {
  const db = getDb();
  if (!db) return;

  await db.collection("analytics").doc(`${userId}_${data.date}`).set(data, { merge: true });
}

export async function getAnalyticsData(
  userId: string,
  startDate: string,
  endDate: string
): Promise<import("./types").AnalyticsData[]> {
  const db = getDb();
  if (!db) return [];

  const snapshot = await db
    .collection("analytics")
    .where("userId", "==", userId)
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .orderBy("date", "asc")
    .get();

  return snapshot.docs.map((doc) => doc.data() as import("./types").AnalyticsData);
}

// Billing operations
export async function saveBillingUsage(
  usage: import("./types").BillingUsage
): Promise<void> {
  const db = getDb();
  if (!db) return;

  await db.collection("billing_usage").doc(`${usage.userId}_${usage.period}`).set(usage);
}

export async function getBillingUsage(
  userId: string,
  period: import("./types").BillingUsage["period"]
): Promise<import("./types").BillingUsage | null> {
  return getDocument<import("./types").BillingUsage>("billing_usage", `${userId}_${period}`);
}

// Product bulk operations
export async function bulkUpdateProducts(
  productIds: string[],
  updates: Partial<Product>
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  const batch = db.batch();
  productIds.forEach((id) => {
    const docRef = db.collection("products").doc(id);
    batch.update(docRef, { ...updates, updatedAt: new Date().toISOString() });
  });
  await batch.commit();
}

export async function bulkDeleteProducts(productIds: string[]): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  const batch = db.batch();
  productIds.forEach((id) => {
    const docRef = db.collection("products").doc(id);
    batch.delete(docRef);
  });
  await batch.commit();
}

// Order bulk operations
export async function bulkUpdateOrders(
  orderIds: string[],
  updates: Partial<Order>
): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not initialized");

  const batch = db.batch();
  orderIds.forEach((id) => {
    const docRef = db.collection("orders").doc(id);
    batch.update(docRef, { ...updates, updatedAt: new Date().toISOString() });
  });
  await batch.commit();
}

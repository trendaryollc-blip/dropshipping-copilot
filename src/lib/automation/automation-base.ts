/**
 * Automation Base Class
 *
 * Provides common functionality for all automation components including:
 * - Detailed logging with different levels
 * - Progress tracking for bulk operations
 * - Error recovery mechanisms
 * - Performance monitoring
 * - Status reporting
 */

export type AutomationStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'partial_success'

export type ProgressUpdate = {
  current: number
  total: number
  percentage: number
  status: string
  timestamp: string
  itemsProcessed?: number
  itemsFailed?: number
  estimatedTimeRemaining?: string
}

export type AutomationResult<T = any> = {
  success: boolean
  status: AutomationStatus
  startTime: string
  endTime: string
  durationMs: number
  itemsProcessed: number
  itemsSucceeded: number
  itemsFailed: number
  errorCount: number
  warnings: string[]
  errors: string[]
  data?: T
  progressHistory: ProgressUpdate[]
}

export type AutomationError = {
  type: 'validation' | 'network' | 'api' | 'database' | 'timeout' | 'unknown'
  message: string
  details?: any
  timestamp: string
  isRecoverable: boolean
  recoveryAttempts: number
}

export class AutomationBase {
  protected status: AutomationStatus = 'idle'
  protected progress: ProgressUpdate[] = []
  protected errors: AutomationError[] = []
  protected warnings: string[] = []
  protected startTime: string | null = null
  protected endTime: string | null = null
  protected itemsProcessed = 0
  protected itemsSucceeded = 0
  protected itemsFailed = 0
  protected operationName: string

  constructor(operationName: string) {
    this.operationName = operationName
  }

  /**
   * Start the automation operation
   */
  protected startOperation(): void {
    this.status = 'running'
    this.startTime = new Date().toISOString()
    this.progress = []
    this.errors = []
    this.warnings = []
    this.itemsProcessed = 0
    this.itemsSucceeded = 0
    this.itemsFailed = 0

    this.logInfo(`Starting ${this.operationName}...`)
    this.updateProgress(0, 'Initializing...')
  }

  /**
   * Complete the automation operation
   */
  protected completeOperation(success: boolean): AutomationResult {
    this.endTime = new Date().toISOString()
    this.status = success ? 'completed' : 'failed'

    const result: AutomationResult = {
      success,
      status: this.status,
      startTime: this.startTime || new Date().toISOString(),
      endTime: this.endTime,
      durationMs: this.startTime ? new Date(this.endTime).getTime() - new Date(this.startTime).getTime() : 0,
      itemsProcessed: this.itemsProcessed,
      itemsSucceeded: this.itemsSucceeded,
      itemsFailed: this.itemsFailed,
      errorCount: this.errors.length,
      warnings: this.warnings,
      errors: this.errors.map(e => e.message),
      progressHistory: this.progress
    }

    if (success) {
      this.logSuccess(`${this.operationName} completed successfully. Processed ${this.itemsProcessed} items (${this.itemsSucceeded} succeeded, ${this.itemsFailed} failed)`)
    } else {
      this.logError(`${this.operationName} completed with errors. Processed ${this.itemsProcessed} items (${this.itemsSucceeded} succeeded, ${this.itemsFailed} failed)`)
    }

    return result
  }

  /**
   * Update progress for bulk operations
   */
  protected updateProgress(current: number, status: string): void
  protected updateProgress(current: number, total: number, status: string, data?: { itemsProcessed?: number; itemsFailed?: number }): void
  protected updateProgress(
    current: number,
    totalOrStatus: number | string,
    statusOrData?: string | { itemsProcessed?: number; itemsFailed?: number },
    data?: { itemsProcessed?: number; itemsFailed?: number }
  ): void {
    const total = typeof totalOrStatus === 'number' ? totalOrStatus : 0
    const status = typeof totalOrStatus === 'string' ? totalOrStatus : (statusOrData as string | undefined) || ''
    const progressData = typeof totalOrStatus === 'number' ? data : (statusOrData as { itemsProcessed?: number; itemsFailed?: number } | undefined)
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0

    if (progressData?.itemsProcessed) {
      this.itemsProcessed = progressData.itemsProcessed
    }

    if (progressData?.itemsFailed) {
      this.itemsFailed = progressData.itemsFailed
    }

    const progressUpdate: ProgressUpdate = {
      current,
      total,
      percentage,
      status,
      timestamp: new Date().toISOString(),
      itemsProcessed: this.itemsProcessed,
      itemsFailed: this.itemsFailed,
      estimatedTimeRemaining: this.calculateEstimatedTimeRemaining(current, total)
    }

    this.progress.push(progressUpdate)

    if (total > 0 && (percentage % 10 === 0 || current === total)) {
      this.logInfo(`Progress: ${percentage}% - ${status} (${current}/${total} items)`)
    }
  }

  /**
   * Calculate estimated time remaining
   */
  private calculateEstimatedTimeRemaining(current: number, total: number): string | undefined {
    if (current === 0 || this.progress.length < 2) return undefined

    const itemsCompleted = current
    const timeElapsed = new Date().getTime() - new Date(this.startTime || new Date()).getTime()
    const itemsPerMs = itemsCompleted / timeElapsed
    const itemsRemaining = total - current
    const timeRemainingMs = itemsRemaining / itemsPerMs

    if (timeRemainingMs < 1000) return 'less than 1 second'
    if (timeRemainingMs < 60000) return `${Math.round(timeRemainingMs / 1000)} seconds`
    if (timeRemainingMs < 3600000) return `${Math.round(timeRemainingMs / 60000)} minutes`

    return `${(timeRemainingMs / 3600000).toFixed(1)} hours`
  }

  /**
   * Log different levels of messages
   */
  protected logInfo(message: string): void {
    console.info(`[${this.operationName}] INFO: ${message}`)
  }

  protected logWarning(message: string): void {
    console.warn(`[${this.operationName}] WARNING: ${message}`)
    this.warnings.push(message)
  }

  protected logError(message: string, error?: any, isRecoverable: boolean = false): void {
    const automationError: AutomationError = {
      type: this.determineErrorType(error),
      message,
      details: error,
      timestamp: new Date().toISOString(),
      isRecoverable,
      recoveryAttempts: 0
    }

    console.error(`[${this.operationName}] ERROR: ${message}`, error || '')
    this.errors.push(automationError)
  }

  protected logSuccess(message: string): void {
    console.log(`[${this.operationName}] SUCCESS: ${message}`)
  }

  /**
   * Determine error type from error object
   */
  private determineErrorType(error: any): AutomationError['type'] {
    if (!error) return 'unknown'

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return 'network'
    }

    if (error.response) {
      if (error.response.status === 400 || error.response.status === 422) return 'validation'
      if (error.response.status === 401 || error.response.status === 403) return 'api'
      if (error.response.status === 429) return 'api'
      if (error.response.status >= 500) return 'api'
    }

    if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
      return 'timeout'
    }

    if (error.message?.includes('database') || error.message?.includes('Firestore')) {
      return 'database'
    }

    return 'unknown'
  }

  /**
   * Add error recovery mechanism
   */
  protected async withRecovery<T>(fn: () => Promise<T>, recoveryFn: (error: any) => Promise<T>, maxAttempts: number = 3): Promise<T> {
    let lastError: any
    let attempt = 0

    while (attempt < maxAttempts) {
      attempt++
      try {
        return await fn()
      } catch (error: any) {
        lastError = error
        this.logError(`Attempt ${attempt} failed: ${error.message}`, error, attempt < maxAttempts)

        if (attempt < maxAttempts) {
          this.logInfo(`Attempting recovery (${attempt}/${maxAttempts})...`)
          try {
            return await recoveryFn(error)
          } catch (recoveryError: any) {
            this.logError(`Recovery attempt ${attempt} failed: ${recoveryError.message}`, recoveryError)
          }
        }
      }
    }

    throw lastError
  }

  /**
   * Process items in batches with progress tracking
   */
  protected async processInBatches<T, R>(
    items: T[],
    batchSize: number,
    processItem: (item: T, batchIndex: number, itemIndex: number) => Promise<R>
  ): Promise<{ successes: R[]; failures: { item: T; error: any }[] }> {
    this.startOperation()

    const successes: R[] = []
    const failures: { item: T; error: any }[] = []

    const totalItems = items.length
    let processedItems = 0

    for (let batchIndex = 0; batchIndex < items.length; batchIndex += batchSize) {
      const batch = items.slice(batchIndex, batchIndex + batchSize)
      const batchNumber = Math.floor(batchIndex / batchSize) + 1
      const totalBatches = Math.ceil(totalItems / batchSize)

      this.logInfo(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)`)

      for (let itemIndex = 0; itemIndex < batch.length; itemIndex++) {
        const item = batch[itemIndex]
        processedItems++

        try {
          const result = await processItem(item, batchNumber, itemIndex)
          successes.push(result)
          this.itemsSucceeded++
        } catch (error) {
          failures.push({ item, error })
          this.itemsFailed++
          this.logError(`Failed to process item ${processedItems}/${totalItems}`, error, true)
        }

        this.updateProgress(processedItems, totalItems, `Processing batch ${batchNumber}/${totalBatches}`, {
          itemsProcessed: processedItems,
          itemsFailed: failures.length
        })
      }
    }

    const result = this.completeOperation(failures.length === 0)
    return { successes, failures }
  }

  /**
   * Get current status
   */
  public getStatus(): AutomationStatus {
    return this.status
  }

  /**
   * Get current progress
   */
  public getCurrentProgress(): ProgressUpdate | null {
    return this.progress.length > 0 ? this.progress[this.progress.length - 1] : null
  }

  /**
   * Get full automation result
   */
  public getResult(): AutomationResult | null {
    if (!this.endTime) return null

    return this.completeOperation(this.errors.length === 0)
  }
}
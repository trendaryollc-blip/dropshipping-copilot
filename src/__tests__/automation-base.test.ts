import { describe, it, expect, beforeEach } from 'vitest'
import { AutomationBase } from '@/lib/automation/automation-base'

class TestAutomation extends AutomationBase {
  constructor() { super('TestAutomation') }
  async runSuccess() {
    this.startOperation()
    this.updateProgress(1, 5, 'Step 1')
    this.updateProgress(3, 5, 'Step 2')
    this.updateProgress(5, 5, 'Complete')
    this.itemsSucceeded = 5
    this.itemsProcessed = 5
    return this.completeOperation(true)
  }
  async runFailure() {
    this.startOperation()
    this.logError('Something went wrong')
    this.itemsFailed = 3
    this.itemsProcessed = 3
    return this.completeOperation(false)
  }
  async runBatch() {
    return this.processInBatches(
      [1, 2, 3, 4, 5],
      2,
      async (item) => {
        if (item === 4) throw new Error('Item 4 failed')
        return item * 2
      }
    )
  }
  async runWithRecovery(successOnAttempt: number = 1) {
    let attempt = 0
    return this.withRecovery(
      async () => {
        attempt++
        if (attempt < successOnAttempt) throw new Error(`Attempt ${attempt} failed`)
        return 'success'
      },
      async () => 'recovered',
      3
    )
  }
  async testDetermineErrorType(error: any) {
    return (this as any).determineErrorType(error)
  }
}

describe('AutomationBase', () => {
  let automator: TestAutomation

  beforeEach(() => {
    automator = new TestAutomation()
  })

  describe('startOperation / completeOperation', () => {
    it('records correct result on success', async () => {
      const result = await automator.runSuccess()
      expect(result.success).toBe(true)
      expect(result.status).toBe('completed')
      expect(result.itemsProcessed).toBe(5)
      expect(result.itemsSucceeded).toBe(5)
      expect(result.itemsFailed).toBe(0)
      expect(result.startTime).toBeTruthy()
      expect(result.endTime).toBeTruthy()
      expect(result.durationMs).toBeGreaterThanOrEqual(0)
      expect(result.errors).toHaveLength(0)
    })

    it('records correct result on failure', async () => {
      const result = await automator.runFailure()
      expect(result.success).toBe(false)
      expect(result.status).toBe('failed')
      expect(result.itemsFailed).toBe(3)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('updateProgress', () => {
    it('tracks progress history', async () => {
      await automator.runSuccess()
      const result = (await automator.runSuccess()) as any
      expect(result.progressHistory.length).toBeGreaterThanOrEqual(3)
      const first = result.progressHistory[0]
      expect(first).toHaveProperty('current')
      expect(first).toHaveProperty('total')
      expect(first).toHaveProperty('percentage')
      expect(first).toHaveProperty('status')
      expect(first).toHaveProperty('timestamp')
    })
  })

  describe('processInBatches', () => {
    it('processes items and collects successes and failures', async () => {
      const result = await automator.runBatch()
      expect(result.successes).toHaveLength(4) // items 1,2,3,5 succeed
      expect(result.failures).toHaveLength(1)  // item 4 fails
      expect(result.failures[0].item).toBe(4)
    })

    it('returns empty successes when all fail', async () => {
      class FailingAutomation extends TestAutomation {
        async runAllFail() {
          return this.processInBatches([1, 2], 1, async () => { throw new Error('fail') })
        }
      }
      const failing = new FailingAutomation()
      const result = await failing.runAllFail()
      expect(result.successes).toHaveLength(0)
      expect(result.failures).toHaveLength(2)
    })
  })

  describe('withRecovery', () => {
    it('succeeds on first attempt', async () => {
      const result = await automator.runWithRecovery(1)
      expect(result).toBe('success')
    })

    it('recovers after failure', async () => {
      const result = await automator.runWithRecovery(2)
      expect(result).toBe('recovered')
    })
  })

  describe('determineErrorType', () => {
    it('detects network errors', async () => {
      const type = await automator.testDetermineErrorType({ code: 'ENOTFOUND' })
      expect(type).toBe('network')
    })

    it('detects api errors', async () => {
      const type = await automator.testDetermineErrorType({ response: { status: 429 } })
      expect(type).toBe('api')
    })

    it('detects validation errors', async () => {
      const type = await automator.testDetermineErrorType({ response: { status: 422 } })
      expect(type).toBe('validation')
    })

    it('detects timeout errors', async () => {
      const type = await automator.testDetermineErrorType({ message: 'timeout exceeded' })
      expect(type).toBe('timeout')
    })

    it('detects database errors', async () => {
      const type = await automator.testDetermineErrorType({ message: 'Firestore error' })
      expect(type).toBe('database')
    })

    it('defaults to unknown', async () => {
      const type = await automator.testDetermineErrorType(null)
      expect(type).toBe('unknown')
    })
  })

  describe('getStatus / getCurrentProgress / getResult', () => {
    it('returns idle initially', () => {
      expect(automator.getStatus()).toBe('idle')
    })

    it('returns null result when not completed', () => {
      expect(automator.getResult()).toBeNull()
    })

    it('returns null progress when not started', () => {
      expect(automator.getCurrentProgress()).toBeNull()
    })

    it('returns result after completion', async () => {
      await automator.runSuccess()
      const result = automator.getResult()
      expect(result).not.toBeNull()
      expect(result!.success).toBe(true)
    })
  })
})
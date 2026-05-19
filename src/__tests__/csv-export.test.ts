import { describe, it, expect, vi } from 'vitest'
import { exportToCSV } from '@/lib/csv-export'

describe('csv export utility', () => {
  it('does not throw and appends+removes anchor', () => {
    const spy = vi.spyOn(URL, 'createObjectURL')
    const data = [{ a: 1, b: 'x' }, { a: 2, b: 'y' }]
    // before call, no anchors
    const before = document.body.querySelectorAll('a').length
    exportToCSV(data, 'testfile')
    const after = document.body.querySelectorAll('a').length
    expect(after).toBe(before)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})

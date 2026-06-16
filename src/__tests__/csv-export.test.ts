import { describe, it, expect, vi } from 'vitest'
import { exportToCSV } from '@/lib/csv-export'

describe('csv export utility', () => {
  it('does not throw and appends+removes anchor', () => {
    // Mock URL.createObjectURL
    const spy = vi.spyOn(URL, 'createObjectURL')
    spy.mockReturnValue('blob:test')

    // Mock document.createElement and append/remove
    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
      remove: vi.fn()
    }
    const createElementSpy = vi.spyOn(document, 'createElement')
    createElementSpy.mockReturnValue(mockAnchor as any)

    const data = [{ a: 1, b: 'x' }, { a: 2, b: 'y' }]
    // before call, no anchors
    const before = document.body.querySelectorAll('a').length
    exportToCSV(data, 'testfile')
    const after = document.body.querySelectorAll('a').length
    expect(after).toBe(before)
    expect(spy).toHaveBeenCalled()
    expect(mockAnchor.click).toHaveBeenCalled()
    expect(mockAnchor.remove).toHaveBeenCalled()

    spy.mockRestore()
    createElementSpy.mockRestore()
  })
})
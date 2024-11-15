import path from 'path'
import { expect, describe, it } from 'vitest'
import list from './list'

describe('list', () => {
  it('matches the snapshot', () => {
    const nextList = list
      .map((item) => path.relative(process.cwd(), item))
      .sort()

    expect(nextList).toMatchSnapshot()
  })
})
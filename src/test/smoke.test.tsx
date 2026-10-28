import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import styles from './smoke.module.css'

// Feature: add-new-note, Task 1.1 smoke test
// Verifies the test environment works end-to-end:
//   - Vitest runner executes
//   - jsdom environment renders React components
//   - @testing-library/react queries the DOM
//   - @testing-library/jest-dom matchers are available
//   - CSS Modules imports resolve to a class-name object

function Greeting() {
  return <div className={styles.smoke}>Hello, World!</div>
}

describe('test environment smoke test', () => {
  it('renders a React component in jsdom with Testing Library', () => {
    render(<Greeting />)
    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
  })

  it('supports CSS Modules imports', () => {
    expect(styles.smoke).toBeDefined()
    expect(typeof styles.smoke).toBe('string')
  })
})

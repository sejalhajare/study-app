import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AnimatedButton } from './AnimatedButton'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cute p-8">
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6">😢</div>
            <h1 className="text-2xl font-bold text-gradient mb-3">Oops! Something went wrong</h1>
            <p className="text-muted-foreground mb-6 text-sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <AnimatedButton onClick={() => this.setState({ hasError: false })}>
              Try Again 🌸
            </AnimatedButton>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

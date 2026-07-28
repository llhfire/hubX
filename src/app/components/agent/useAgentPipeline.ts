import { useState, useCallback, useRef } from 'react'

export type AgentStatus = 'idle' | 'submitting' | 'analyzing' | 'completed'

export interface AgentPipelineState<T> {
  status: AgentStatus
  result: T | null
  submitAction: () => void
  reset: () => void
}

/**
 * 模拟 Agent 静默异步处理流程
 *
 * 提交 → 瞬间返回成功 → "analyzing" 状态 → 2~3秒后 "completed"
 * 用 setTimeout 模拟真实后台 LangGraph 处理延迟
 */
export function useAgentPipeline<T>(mockResult: T, delayMs = 2500): AgentPipelineState<T> {
  const [status, setStatus] = useState<AgentStatus>('idle')
  const [result, setResult] = useState<T | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const submitAction = useCallback(() => {
    // 第一步：瞬间提交成功，进入 analyzing 状态
    setStatus('submitting')

    // 短暂延迟后切换到 analyzing（模拟事件入队）
    setTimeout(() => {
      setStatus('analyzing')
    }, 200)

    // 模拟 LangGraph 后台处理
    timerRef.current = setTimeout(() => {
      setResult(mockResult)
      setStatus('completed')
    }, delayMs)
  }, [mockResult, delayMs])

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setStatus('idle')
    setResult(null)
  }, [])

  return { status, result, submitAction, reset }
}

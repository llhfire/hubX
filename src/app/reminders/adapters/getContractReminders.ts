import type { ReminderItem } from '../types'
import type { Contract, ReminderData } from '../mockData'

const EXPIRY_WINDOW_DAYS = 7

function getLocalDayStart(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

export function getContractReminders(data: ReminderData, now: Date = new Date()): ReminderItem[] {
  const currentDayStart = getLocalDayStart(now)
  const cutoffDayStart = getLocalDayStart(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + EXPIRY_WINDOW_DAYS),
  )

  return data.contracts
    .filter((contract: Contract) => {
      if (contract.status !== 'active') return false

      const expireDayStart = getLocalDayStart(new Date(contract.expireDate))
      return expireDayStart >= currentDayStart && expireDayStart <= cutoffDayStart
    })
    .map((contract: Contract): ReminderItem => {
      const expireDayStart = getLocalDayStart(new Date(contract.expireDate))
      const daysLeft = Math.round((expireDayStart - currentDayStart) / (24 * 60 * 60 * 1000))

      return {
        id: contract.id,
        type: 'contract_expiring',
        title: '合同即将到期',
        content: `${contract.name} 将在 ${daysLeft <= 0 ? '今天' : `${daysLeft} 天后`} 到期`,
        sourceId: contract.id,
        sourceType: 'contract',
        priority: 'medium',
        createdAt: contract.signingDate,
        deadline: contract.expireDate,
        actionLabel: '查看合同',
        actionTarget: {
          kind: 'route',
          path: `/contracts/${contract.id}`,
        },
      }
    })
}

// utils/stepManager.ts

export interface CreateStep {
  step: number
  name: string
  route: string
  title: string
  storageKey: string
  requiredFields: string[]
}

export const CREATE_STEPS: CreateStep[] = [
  {
    step: 1,
    name: 'exploring-label',
    route: '/create/exploring-label',
    title: '探索标签',
    storageKey: 'selectedExploringCategories',
    requiredFields: ['categories'] // 至少选择2个分类
  },
  {
    step: 2,
    name: 'interest-label',
    route: '/create/interest-label',
    title: '兴趣标签',
    storageKey: 'selectedInterestLabels',
    requiredFields: ['interests'] // 至少选择3个兴趣
  },
  {
    step: 3,
    name: 'location-map',
    route: '/create/location-map',
    title: '位置地图',
    storageKey: 'selectedLocations',
    requiredFields: ['locations'] // 至少选择1个地点
  },
  {
    step: 4,
    name: 'script-customization',
    route: '/create/script-customization',
    title: '剧本定制',
    storageKey: 'scriptCustomizationData',
    requiredFields: ['name', 'description', 'types'] // 必填信息
  }
]

export class StepManager {
  /**
   * 检查指定步骤是否已完成
   */
  static isStepCompleted(step: number): boolean {
    const stepInfo = CREATE_STEPS.find(s => s.step === step)
    if (!stepInfo) return false

    const data = localStorage.getItem(stepInfo.storageKey)
    if (!data) return false

    try {
      const parsedData = JSON.parse(data)
      return this.validateStepData(stepInfo, parsedData)
    } catch {
      return false
    }
  }

  /**
   * 验证步骤数据是否有效
   */
  static validateStepData(stepInfo: CreateStep, data: any): boolean {
    switch (stepInfo.step) {
      case 1: // 探索标签
        return Array.isArray(data) && data.length >= 2 && data.length <= 4
      case 2: // 兴趣标签
        return Array.isArray(data) && data.length >= 3
      case 3: // 位置地图
        return Array.isArray(data) && data.length >= 1
      case 4: // 剧本定制
        return data && data.name && data.description && data.types && data.types.length > 0
      default:
        return false
    }
  }

  /**
   * 获取用户可以访问的最大步骤
   */
  static getMaxAccessibleStep(): number {
    for (let i = 1; i <= CREATE_STEPS.length; i++) {
      if (!this.isStepCompleted(i)) {
        return i
      }
    }
    return CREATE_STEPS.length // 所有步骤都完成
  }

  /**
   * 检查用户是否可以访问指定步骤
   */
  static canAccessStep(targetStep: number): boolean {
    const maxStep = this.getMaxAccessibleStep()
    return targetStep <= maxStep
  }

  /**
   * 获取下一个未完成的步骤路由
   */
  static getNextIncompleteStepRoute(): string {
    const nextStep = this.getMaxAccessibleStep()
    const stepInfo = CREATE_STEPS.find(s => s.step === nextStep)
    return stepInfo ? stepInfo.route : '/create'
  }

  /**
   * 保存步骤数据
   */
  static saveStepData(step: number, data: any): boolean {
    const stepInfo = CREATE_STEPS.find(s => s.step === step)
    if (!stepInfo) return false

    try {
      localStorage.setItem(stepInfo.storageKey, JSON.stringify(data))
      console.log(`✅ 步骤${step}数据已保存:`, data)
      return true
    } catch (error) {
      console.error(`❌ 保存步骤${step}数据失败:`, error)
      return false
    }
  }

  /**
   * 获取步骤数据
   */
  static getStepData(step: number): any {
    const stepInfo = CREATE_STEPS.find(s => s.step === step)
    if (!stepInfo) return null

    try {
      const data = localStorage.getItem(stepInfo.storageKey)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  /**
   * 清除所有步骤数据（重新开始）
   */
  static clearAllStepData(): void {
    CREATE_STEPS.forEach(step => {
      localStorage.removeItem(step.storageKey)
    })
    console.log('🗑️ 所有创建步骤数据已清除')
  }

  /**
   * 获取步骤进度信息
   */
  static getProgressInfo(): {
    currentStep: number
    totalSteps: number
    completedSteps: number
    progress: number
  } {
    const totalSteps = CREATE_STEPS.length
    let completedSteps = 0

    for (let i = 1; i <= totalSteps; i++) {
      if (this.isStepCompleted(i)) {
        completedSteps++
      } else {
        break
      }
    }

    const currentStep = Math.min(completedSteps + 1, totalSteps)
    const progress = Math.round((completedSteps / totalSteps) * 100)

    return {
      currentStep,
      totalSteps,
      completedSteps,
      progress
    }
  }

  /**
   * 检查是否所有步骤都已完成
   */
  static isAllStepsCompleted(): boolean {
    return CREATE_STEPS.every(step => this.isStepCompleted(step.step))
  }
}

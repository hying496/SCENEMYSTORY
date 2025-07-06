// src/utils/stepManager.ts

/**
 * 创建流程步骤管理器
 * 管理从景点选择到角色定制的完整流程
 */

export interface StepInfo {
  step: number
  name: string
  route: string
  storageKey: string
  required: boolean
}

export const CREATE_STEPS: StepInfo[] = [
  {
    step: 1,
    name: '探索标签',
    route: '/create/exploring-label',
    storageKey: 'create_step_1_exploring',
    required: true
  },
  {
    step: 2,
    name: '兴趣标签',
    route: '/create/interest-label',
    storageKey: 'create_step_2_interest',
    required: true
  },
  {
    step: 3,
    name: '位置地图',
    route: '/create/location-map',
    storageKey: 'create_step_3_location',
    required: true
  },
  {
    step: 4,
    name: '剧本定制',
    route: '/create/script-customization',
    storageKey: 'create_step_4_script',
    required: true
  },
  {
    step: 5,
    name: '角色定制',
    route: '/create/character-customization',
    storageKey: 'create_step_5_character',
    required: true
  }
]

export class StepManager {
  /**
   * 检查步骤是否已完成
   */
  static isStepCompleted(step: number): boolean {
    const stepInfo = CREATE_STEPS.find(s => s.step === step)
    if (!stepInfo) return false

    const data = localStorage.getItem(stepInfo.storageKey)
    return data !== null && data !== ''
  }

  /**
   * 获取下一个未完成的步骤
   */
  static getNextStep(): StepInfo | null {
    for (const step of CREATE_STEPS) {
      if (!this.isStepCompleted(step.step)) {
        return step
      }
    }
    return null // 所有步骤都已完成
  }

  /**
   * 获取当前应该进行的步骤
   */
  static getCurrentStep(): StepInfo {
    const nextStep = this.getNextStep()
    return nextStep || CREATE_STEPS[CREATE_STEPS.length - 1] // 如果都完成了，返回最后一步
  }

  /**
   * 检查是否可以进入指定步骤
   */
  static canAccessStep(step: number): boolean {
    if (step === 1) return true // 第一步总是可以访问

    // 检查前面的必需步骤是否都已完成
    for (let i = 1; i < step; i++) {
      const stepInfo = CREATE_STEPS.find(s => s.step === i)
      if (stepInfo?.required && !this.isStepCompleted(i)) {
        return false
      }
    }
    return true
  }

  /**
   * 获取步骤信息
   */
  static getStepInfo(step: number): StepInfo | null {
    return CREATE_STEPS.find(s => s.step === step) || null
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
    // 清除相关的预览和角色定制数据
    localStorage.removeItem('scriptPreview')
    localStorage.removeItem('characterCustomization')
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

  /**
   * 获取完整的创建数据（所有步骤的数据合并）
   */
  static getCompleteCreationData(): any {
    const allData: any = {
      steps: {},
      preview: null,
      character: null,
      completedAt: null
    }

    // 获取各步骤数据
    CREATE_STEPS.forEach(step => {
      allData.steps[step.step] = this.getStepData(step.step)
    })

    // 获取预览数据
    try {
      const previewData = localStorage.getItem('scriptPreview')
      allData.preview = previewData ? JSON.parse(previewData) : null
    } catch (error) {
      console.error('获取预览数据失败:', error)
    }

    // 获取角色定制数据
    try {
      const characterData = localStorage.getItem('characterCustomization')
      allData.character = characterData ? JSON.parse(characterData) : null
    } catch (error) {
      console.error('获取角色定制数据失败:', error)
    }

    // 如果所有步骤都完成，标记完成时间
    if (this.isAllStepsCompleted() && allData.character) {
      allData.completedAt = allData.character.completedAt || Date.now()
    }

    return allData
  }

  /**
   * 导航到下一个步骤
   */
  static navigateToNextStep(router: any): boolean {
    const nextStep = this.getNextStep()
    if (nextStep) {
      router.push(nextStep.route)
      return true
    }
    return false // 所有步骤都已完成
  }

  /**
   * 验证步骤数据的有效性
   */
  static validateStepData(step: number, data: any): boolean {
    switch (step) {
      case 1: // 探索标签
        return Array.isArray(data) && data.length >= 2 && data.length <= 4

      case 2: // 兴趣标签
        return data && typeof data === 'object'

      case 3: // 位置地图
        return Array.isArray(data) && data.length > 0

      case 4: // 剧本定制
        return data && data.scriptInfo && data.scriptInfo.name && data.scriptInfo.description

      case 5: // 角色定制
        return data && data.character && data.role && data.design

      default:
        return false
    }
  }

  /**
   * 获取步骤完成状态摘要
   */
  static getStepsSummary(): Array<{
    step: number
    name: string
    completed: boolean
    data?: any
  }> {
    return CREATE_STEPS.map(stepInfo => ({
      step: stepInfo.step,
      name: stepInfo.name,
      completed: this.isStepCompleted(stepInfo.step),
      data: this.getStepData(stepInfo.step)
    }))
  }

  /**
   * 重置特定步骤
   */
  static resetStep(step: number): boolean {
    const stepInfo = CREATE_STEPS.find(s => s.step === step)
    if (!stepInfo) return false

    localStorage.removeItem(stepInfo.storageKey)
    console.log(`🔄 步骤${step}已重置`)
    return true
  }

  /**
   * 检查创建流程的完整性
   */
  static checkIntegrity(): {
    isValid: boolean
    missingSteps: number[]
    invalidSteps: number[]
  } {
    const missingSteps: number[] = []
    const invalidSteps: number[] = []

    CREATE_STEPS.forEach(stepInfo => {
      const data = this.getStepData(stepInfo.step)

      if (!data) {
        missingSteps.push(stepInfo.step)
      } else if (!this.validateStepData(stepInfo.step, data)) {
        invalidSteps.push(stepInfo.step)
      }
    })

    return {
      isValid: missingSteps.length === 0 && invalidSteps.length === 0,
      missingSteps,
      invalidSteps
    }
  }
}

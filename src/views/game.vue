<template>
  <div class="page-container">
    <div class="header">
      <button class="back-btn" @click="router.back()" aria-label="返回上一页">←</button>
      <h1 class="main-title">剧本游</h1>
    </div>

    <div v-if="data.attractionList.length" class="attraction-block">
      <div
        v-for="(attraction, i) in data.attractionList"
        :key="i"
        v-show="i === currentIndex.attraction || completedAttractions.includes(i)"
      >
        <h2 class="attraction-title">{{ attraction.attractionName }}</h2>

        <div
          v-for="(station, j) in attraction.stationList"
          :key="j"
          v-show="j === currentIndex.station || completedStations[i]?.includes(j)"
          class="station-block"
        >
          <h3 class="station-title">{{ station.stationName }}</h3>

          <div
            v-for="(point, k) in station.explorationPointList"
            :key="k"
            v-show="k === currentIndex.point || completedPoints[j]?.includes(k)"
            class="question-block"
          >
            <div class="question-content">{{ renderQuestion(point, k) }}</div>

            <!-- 选择题 -->
            <ul v-if="point.questionType === '选择题'" class="option-list">
              <li v-for="(option, index) in point.options" :key="index">
                <label>
                  <input
                    type="radio"
                    :name="'q-' + j + '-' + k"
                    :value="option.slice(0, 1)"
                    v-model="userAnswer"
                    :disabled="getQuestionState(k).isCorrect"
                  />
                  {{ option }}
                </label>
              </li>
            </ul>

            <!-- 填空题 -->
            <div v-else-if="point.questionType === '填空题'">
              <input
                type="text"
                v-model="userAnswer"
                :disabled="getQuestionState(k).isCorrect"
                placeholder="请输入答案"
                class="fill-blank-input"
                @keyup.enter="submitAnswer(point)"
              />
            </div>

            <!-- 判断题 -->
            <div v-else-if="point.questionType === '判断题'">
              <button
                class="judge-btn"
                :class="{ selected: userAnswer === true }"
                @click="selectJudge(true)"
                :disabled="getQuestionState(k).isCorrect"
              >正确</button>
              <button
                class="judge-btn"
                :class="{ selected: userAnswer === false }"
                @click="selectJudge(false)"
                :disabled="getQuestionState(k).isCorrect"
              >错误</button>
            </div>

            <div class="action-buttons" v-if="!getQuestionState(k).isCorrect">
              <button @click="submitAnswer(point)">提交答案</button>
            </div>

            <div v-if="getQuestionState(k).isCorrect" class="answer-area">
              <p class="correct-text">回答正确！</p>
              <details class="answer-details" open>
                <summary class="answer-summary">参考答案</summary>
                <p><strong>正确答案：</strong> {{ formatAnswer(point.correctAnswer) }}</p>
                <p><strong>解析：</strong> {{ point.answerExplanation }}</p>
              </details>
              <button @click="goToNextQuestion">下一题</button>
            </div>

            <div v-if="getQuestionState(k).answered && !getQuestionState(k).isCorrect" class="wrong-text">
              回答错误，请重试。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import attractionData from '../../public/attractionData.json'

const router = useRouter()
const data = ref({ attractionList: [] })

onMounted(() => {
  data.value = attractionData
  loadCurrentQuestionState()
})

const currentIndex = reactive({
  attraction: 0,
  station: 0,
  point: 0,
})

const userAnswer = ref('')

const completedAttractions = reactive([])
const completedStations = reactive({})
const completedPoints = reactive({})

const questionStates = reactive({})

const currentAttraction = computed(() => data.value.attractionList[currentIndex.attraction] || { stationList: [] })

const renderQuestion = (point, index) => `${index + 1}. ${point.questionContent}`

const formatAnswer = (answer) => (typeof answer === 'boolean' ? (answer ? '正确' : '错误') : answer)

function getQuestionState(k) {
  const key = `${currentIndex.attraction}-${currentIndex.station}-${k}`
  return questionStates[key] || {}
}

function checkAnswer(point, answer) {
  if (point.questionType === '填空题') {
    return answer.trim().toLowerCase() === point.correctAnswer.toString().trim().toLowerCase()
  } else if (point.questionType === '选择题' || point.questionType === '判断题') {
    return answer === point.correctAnswer
  }
  return false
}

function submitAnswer(point) {
  if (userAnswer.value === '' || userAnswer.value === null || userAnswer.value === undefined) {
    alert('请先作答！')
    return
  }

  const key = `${currentIndex.attraction}-${currentIndex.station}-${currentIndex.point}`
  const correct = checkAnswer(point, userAnswer.value)

  questionStates[key] = {
    answered: true,
    isCorrect: correct,
    userAnswer: userAnswer.value,
  }

  if (!completedPoints[currentIndex.station]) {
    completedPoints[currentIndex.station] = []
  }
  if (correct && !completedPoints[currentIndex.station].includes(currentIndex.point)) {
    completedPoints[currentIndex.station].push(currentIndex.point)
  }
}

function selectJudge(val) {
  userAnswer.value = val
}

function loadCurrentQuestionState() {
  const key = `${currentIndex.attraction}-${currentIndex.station}-${currentIndex.point}`
  const state = questionStates[key] || {}
  userAnswer.value = state.userAnswer ?? ''
}

function goToNextQuestion() {
  const stations = currentAttraction.value.stationList
  const points = stations[currentIndex.station].explorationPointList

  if (!completedStations[currentIndex.attraction]) {
    completedStations[currentIndex.attraction] = []
  }
  if (!completedStations[currentIndex.attraction].includes(currentIndex.station)) {
    completedStations[currentIndex.attraction].push(currentIndex.station)
  }

  if (currentIndex.point + 1 < points.length) {
    currentIndex.point++
  } else if (currentIndex.station + 1 < stations.length) {
    currentIndex.station++
    currentIndex.point = 0
  } else {
    if (!completedAttractions.includes(currentIndex.attraction)) {
      completedAttractions.push(currentIndex.attraction)
    }
    alert('恭喜，已完成本景点所有题目！即将返回首页')
    router.push('/home')
    return
  }
  loadCurrentQuestionState()
}
</script>

<style scoped>
.page-container {
  padding: calc(var(--safe-area-inset-top, 16px) + 12px) 20px calc(var(--safe-area-inset-bottom, 16px) + 12px) 20px;
  background-color: #e6f0ff;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  color: #1a3d7c;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.back-btn {
  font-size: 1.2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #5a7ec8;
  font-weight: 600;
  margin-right: 8px;
  user-select: none;
  padding: 2px 6px;
  line-height: 1;
  transition: color 0.3s ease;
  border-radius: 4px;
}

.back-btn:hover {
  color: #2c4db7;
  background-color: #dbeafe;
}

.main-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0;
  text-align: center;
  color: #2563eb;
}

.attraction-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 16px;
  border-bottom: 2px solid #93c5fd;
  padding-bottom: 4px;
}

.station-block {
  margin-bottom: 20px;
}

.station-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 12px;
}

.question-block {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
  margin-bottom: 10px;
}

.question-content {
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 1rem;
  line-height: 1.4;
}

.option-list {
  list-style-type: disc;
  padding-left: 20px;
  margin-bottom: 12px;
}

.option-list li {
  margin-bottom: 6px;
}

.option-list label {
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  color: #1e40af;
}

input[type="radio"] {
  margin-right: 8px;
}

.fill-blank-input {
  width: 100%;
  padding: 8px 12px;
  border: 1.5px solid #93c5fd;
  border-radius: 8px;
  font-size: 1rem;
  color: #1a3d7c;
  outline: none;
  user-select: text;
}

.fill-blank-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 6px #2563ebaa;
}

.judge-btn {
  background-color: #93c5fd;
  border: none;
  color: #1e40af;
  padding: 8px 20px;
  margin-right: 12px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}

.judge-btn.selected {
  background-color: #2563eb;
  color: white;
}

.judge-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.action-buttons {
  margin-top: 14px;
  text-align: right;
}

button {
  background-color: #2563eb;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #1d4ed8;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.correct-text {
  color: #166534;
  font-weight: 700;
  margin-top: 12px;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.wrong-text {
  color: #b91c1c;
  font-weight: 700;
  margin-top: 8px;
  font-size: 1rem;
}

.answer-details {
  background: #dbeafe;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  color: #1e3a8a;
  font-size: 0.9rem;
  user-select: text;
}

.answer-summary {
  cursor: pointer;
  color: #2563eb;
  font-weight: 600;
  user-select: none;
}

.answer-area {
  margin-top: 10px;
}
</style>

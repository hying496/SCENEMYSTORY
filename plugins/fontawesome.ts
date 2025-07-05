// plugins/fontawesome.ts
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 导入需要的图标
import {
  faHome,
  faUser,
  faPlus,
  faEye,
  faEyeSlash,
  faArrowLeft,
  faSearch,
  faWifi,
  faBatteryFull,
  faSignal,
  faHeart,
  faCog,
  faShoppingCart,
  faMapMarkerAlt,
  faCalendar,
  faPhone,
  faBars,
  faTimes,
  faChevronRight,
  faChevronLeft,
  faChevronDown,
  faChevronUp,
  faBell,
  faMap,
  faUsers,
  faCastle,
  faBuilding,
  faPlayCircle,
  faCheckCircle,
  faClock,
  faStar,
  faImage,
  faLock
} from '@fortawesome/free-solid-svg-icons'

import {
  faHeart as faHeartRegular,
  faUser as faUserRegular
} from '@fortawesome/free-regular-svg-icons'

// 添加图标到库
library.add(
  // Solid icons
  faHome,
  faUser,
  faPlus,
  faEye,
  faEyeSlash,
  faArrowLeft,
  faSearch,
  faWifi,
  faBatteryFull,
  faSignal,
  faHeart,
  faCog,
  faShoppingCart,
  faMapMarkerAlt,
  faCalendar,
  faPhone,
  faBars,
  faTimes,
  faChevronRight,
  faChevronLeft,
  faChevronDown,
  faChevronUp,
  faBell,
  faMap,
  faUsers,
  faCastle,
  faBuilding,
  faPlayCircle,
  faCheckCircle,
  faClock,
  faStar,
  faImage,
  faLock,
  
  // Regular icons
  faHeartRegular,
  faUserRegular
)

export { FontAwesomeIcon }
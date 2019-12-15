console.log('햄스터용품을 판매하는 쇼핑몰 서버입니다')

// 모듈 추출
var express = require('express')
var session = require('express-session')

// 서버 객체 생성
var app = express()
// 각 페이지 라우터
var indexRouter = require('./router/index')

// jade엔진을 사용, view 폴더 설정
app.set('view engine', 'jade')
app.set('views', 'view')

// 바디파서 사용
app.use(express.urlencoded({
  extended: true
}))

// 세션 사용
app.use(session({
  secret: '웹응용프로그래밍',
  resave: false,
  saveUninitialized: true
}))

// CSS 페이지는 정적파일로 제공
app.use('/css', express.static('./css'))
// JS 정적으로 제공
app.use('/js', express.static('./js'))
// 이미지 정적 제공
app.use('/img', express.static('./img'))

// 루트 페이지
app.use('/', indexRouter)

// 서버를 오픈
app.listen(80, function(req, res) {
  console.log('웹 서버를 실행합니다')
})

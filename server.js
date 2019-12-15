console.log('햄스터용품을 판매하는 쇼핑몰 서버입니다')

// 모듈 추출
var express = require('express')
var session = require('express-session')

// 서버 객체 생성
var app = express()
// 각 페이지 라우터
var indexRouter = require('./router/index')

var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

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

// 매니저의 소켓 아이디
var id = 0

// 소켓 접속을 처리해주자
io.on('connection', function(socket) {

  // 누군가 매니저 페이지로 접속 시, 매니저 아이디를 지정해준다
  socket.on('manager', function(data) {
    console.log('Manager Connected!')
    id = socket.id
  })

  // 주문이 들어오는 경우
  socket.on('order', function(data) {
    console.log('Order Requested!')
    // TODO 주문 발생 시, DB에 주문정보를 저장가능하게 만들어주자
    io.sockets.to(id).emit('order', data)
  })
})

// 서버를 오픈
server.listen(80, function(req, res) {
  console.log('웹 서버를 실행합니다')
})

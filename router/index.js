// 인덱스 페이지 라우터
var express = require('express')
var router = express.Router()
const crypto = require('crypto')
var mariadb = require('mysql')
var dbconfig = {
  host: 'localhost',
  user: 'nodewebadmin',
  password: 'hellonode',
  database: 'nodeweb'
}

// 루트 라우터
router.get('/', function(req, res, next) {
  // 세션이 존재하는 경우 질의문을 한번 더 보내 로그인 정보가 맞는지 확인한다
  var conn = mariadb.createConnection(dbconfig)
  conn.connect()
  conn.query('SELECT * FROM accounts WHERE userID = ? AND userPW = ?', [req.session.sessID, req.session.sessPW], function(err, results) {
    // 세션값이 DB와 일치하지 않을경우
    if (results.length != 1) {
      req.session.sessID = ''
      req.session.sessPW = ''
      req.session.logged = false
    } else {
      req.session.logged = true
    }
    // 제품들을 입력하자
    var conn2 = mariadb.createConnection(dbconfig)
    conn2.query('SELECT * FROM products', function(err2, results2) {
      res.render('index', {login: req.session.logged, products: results2})
    })
    conn2.end()
  })
  conn.end()
})

// POST 라우터
router.post('/login', function(req, res, next) {
  // 로그인을 시도할 때, sha256으로 암호화
  var loginID = req.body['loginID']
  var loginPW = crypto.createHash('sha256').update(req.body['loginPW']).digest('base64')

  // 로그인 정보를 입력하지 않은경우
  if (loginID == '' || loginPW == '') {
    res.send('<script>alert("로그인 정보를 모두 입력하세요!");history.back();</script>')
  }
  else {
    // MariaDB 연결정보 초기화
    var conn = mariadb.createConnection(dbconfig)

    // MariaDB 연결
    conn.connect();

    // 쿼리 질의문 실행
    conn.query('SELECT * FROM accounts WHERE userID=? AND userPW=?', [loginID, loginPW], function(error, results) {
      if (results.length != 1) {
        // 세션 비우기
        req.session.sessID = ''
        req.session.sessPW = ''

        // 실패 메시지 출력
        res.send('<script>alert("회원정보가 일치하지 않습니다"); history.back();</script>')
      } else {
        // 세션 저장
        req.session.sessID = loginID
        req.session.sessPW = loginPW

        // 홈으로 리다이렉트
        res.redirect('/')
      }
    })

    conn.end();  // MariaDB 연결 해제
  }
})

router.post('/register', function(req, res, next) {
  // POST 파라미터 변수에 할당
  var regID = req.body['regID']
  var regPW = crypto.createHash('sha256').update(req.body['regPW']).digest('base64')
  var regPWCheck = crypto.createHash('sha256').update(req.body['regPWCheck']).digest('base64')
  var regName = req.body['regName']
  var regPhone = req.body['regPhone']
  var regAddress = req.body['regAddress']

  // 폼을 모두 완성하지 않은 경우
  if (regID == '' || regPW == '' || regPWCheck == '' || regName == '' || regPhone == '' || regAddress == '') {
    res.send('<script>alert("회원가입 정보를 모두 입력해주세요!"); history.back();</script>')
  } else {
    // 비밀번호를 제대로 확인하지 않은 경우
    if (regPW != regPWCheck) {
      res.send('<script>alert("비밀번호를 확인하여 주세요!"); history.back();</script>')
    } else {
      conn = mariadb.createConnection(dbconfig)
      conn.connect()

      conn.query("INSERT INTO accounts(name, userID, userPW, phone, address) VALUES(?, ?, ?, ?, ?)", [regName, regID, regPW, regPhone, regAddress], function(error, results) {
        // 쿼리 입력에 문제가 생긴 경우
        if (error != null) {
          res.send('<script>alert("내부적인 문제로 인해, 회원가입에 실패하였습니다.")')
        } else {
          res.send('<script>alert("회원가입 되었습니다!"); window.location.href="/";</script>')
        }
      })

      conn.end()
    }
  }
})

// 로그아웃 기능
router.post('/logout', function(req, res, next) {
  req.session.sessID = ''
  req.session.sessPW = ''
  req.session.logged = ''
  res.redirect('/')
})

// 주문 기능
router.post('/order', function(req, res, next) {
  if (req.session.sessID == null || req.session.sessID == '') {
    res.send('<script>alert("로그인 후 사용가능합니다!");history.back();</script>')
  } else {
    res.render('order', {product_id: req.body.product_id})
  }
})

// 관리자 페이지
router.get('/manager', function(req, res, next) {
  res.render('manager')
})

module.exports = router

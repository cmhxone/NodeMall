// 메인 스타일과 기능을 지정하는 스크립트
$(document).ready( function() {
  // 네비게이션 메뉴 마우스 이벤트
  $(".navmenu").hover(function() {
    $(this).css("color", "red");
    $(this).css("font-weight", "bold");
  }, function() {
    $(this).css("color", "black");
    $(this).css("font-weight", "normal")
  });
  // 아티클 숨기기
  $(".article").hide();
  $("#div_main").show();

// 네비게이션 메뉴 클릭 시 기본 수행동작
  $(".navmenu").click(function() {
    $(".article").slideUp(500).delay(500);
  });

  // 먹이 메뉴 선택
  $("#menu_food").click(function() {
    $("#div_food").slideDown(500);
  });

  // 베딩 메뉴 선택
  $("#menu_beding").click(function() {
    $("#div_beding").slideDown(500);
  });

  // 기타 용품 메뉴 선택
  $("#menu_toy").click(function() {
    $("#div_toy").slideDown(500);
  });

  // 햄스터 분양 메뉴 선택
  $("#menu_hamster").click(function() {
    $("#div_hamster").slideDown(500);
  });

  // 로그인 메뉴 선택
  $("#menu_login").click(function() {
    $("#div_login").slideDown(500);
  })

  // 회원가입 메뉴 선택
  $("#menu_register").click(function() {
    $("#div_register").slideDown(500);
  })

  // 로그아웃 메뉴 선택
  $("#menu_logout").click(function() {
    $("#form_logout").submit();
  })
});

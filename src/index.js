import App from "./App.js";

const $app = document.getElementById('app');
/**
 * 생성자 함수를 사용해서 새로운 객체 생성해서 $app 전달
 * - 이 인스턴스는 App 컴포넌트 전체를 초기화하는 진입점 역할만 함
 * - 대부분의 동작이 생성자 안에서 이루어진다.   
 */
new App($app); 

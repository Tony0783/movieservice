<template>
    <div>
      <div class="bg-image"></div>
      <div class="container">
        <div id="phone">
          <div id="content-wrapper">
            <!-- 로그인 카드 -->
            <div :class="['card', { hidden: !isLoginVisible }]" id="login">
              <form @submit.prevent="handleLogin">
                <h1>Sign in</h1>
                <div class="input" :class="{ active: isEmailFocused || email }">
                  <input
                    id="email"
                    type="email"
                    v-model="email"
                    @focus="focusInput('email')"
                    @blur="blurInput('email')"
                    required
                  />
                  <label for="email">Username or Email</label>
                </div>
                <div class="input" :class="{ active: isPasswordFocused || password }">
                  <input
                    id="password"
                    type="password"
                    v-model="password"
                    @focus="focusInput('password')"
                    @blur="blurInput('password')"
                    required
                  />
                  <label for="password">Password</label>
                </div>
                <span class="checkbox remember">
                  <input type="checkbox" id="remember" v-model="rememberMe" />
                  <label for="remember" class="read-text">Remember me</label>
                </span>
                <span class="checkbox forgot">
                  <a href="#">Forgot Password?</a>
                </span>
                <button :disabled="!isLoginFormValid">Login</button>
              </form>
              <a href="javascript:void(0)" class="account-check" @click="toggleCard">
                Already have an account? <b>Sign in</b>
              </a>
            </div>
  
            <!-- 회원가입 카드 -->
            <div :class="['card', { hidden: isLoginVisible }]" id="register">
              <form @submit.prevent="handleRegister">
                <h1>Sign up</h1>
                <div class="input" :class="{ active: isRegisterEmailFocused || registerEmail }">
                  <input
                    id="register-email"
                    type="email"
                    v-model="registerEmail"
                    @focus="focusInput('registerEmail')"
                    @blur="blurInput('registerEmail')"
                    required
                  />
                  <label for="register-email">Email</label>
                </div>
                <div class="input" :class="{ active: isRegisterPasswordFocused || registerPassword }">
                  <input
                    id="register-password"
                    type="password"
                    v-model="registerPassword"
                    @focus="focusInput('registerPassword')"
                    @blur="blurInput('registerPassword')"
                    required
                  />
                  <label for="register-password">Password</label>
                </div>
                <div class="input" :class="{ active: isConfirmPasswordFocused || confirmPassword }">
                  <input
                    id="confirm-password"
                    type="password"
                    v-model="confirmPassword"
                    @focus="focusInput('confirmPassword')"
                    @blur="blurInput('confirmPassword')"
                    required
                  />
                  <label for="confirm-password">Confirm Password</label>
                </div>
                <span class="checkbox remember">
                  <input type="checkbox" id="terms" v-model="acceptTerms" />
                  <label for="terms" class="read-text">
                    I have read <b>Terms and Conditions</b>
                  </label>
                </span>
                <button :disabled="!isRegisterFormValid">Register</button>
              </form>
              <a href="javascript:void(0)" id="gotologin" class="account-check" @click="toggleCard">
                Don't have an account? <b>Sign up</b>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import AuthService from '../../util/auth/auth.service';
  
  export default {
    name: 'SignIn',
    setup() {
      const router = useRouter();
      const authService = new AuthService();
  
      // 상태 변수
      const isLoginVisible = ref(true);
      const email = ref('');
      const password = ref('');
      const registerEmail = ref('');
      const registerPassword = ref('');
      const confirmPassword = ref('');
      const rememberMe = ref(false);
      const acceptTerms = ref(false);
  
      const isEmailFocused = ref(false);
      const isPasswordFocused = ref(false);
      const isRegisterEmailFocused = ref(false);
      const isRegisterPasswordFocused = ref(false);
      const isConfirmPasswordFocused = ref(false);
  
      // 유효성 검사
      const isLoginFormValid = computed(() => !!email.value && !!password.value);
      const isRegisterFormValid = computed(() => {
        return (
          !!registerEmail.value &&
          !!registerPassword.value &&
          !!confirmPassword.value &&
          registerPassword.value === confirmPassword.value &&
          acceptTerms.value
        );
      });
  
      // 카드 전환
      const toggleCard = () => {
        isLoginVisible.value = !isLoginVisible.value;
        setTimeout(() => {
          document.getElementById('register')?.classList.toggle('register-swap');
          document.getElementById('login')?.classList.toggle('login-swap');
        }, 50);
      };
  
      // 입력 포커스 핸들러
      const focusInput = (inputName) => {
        if (inputName === 'email') isEmailFocused.value = true;
        else if (inputName === 'password') isPasswordFocused.value = true;
        else if (inputName === 'registerEmail') isRegisterEmailFocused.value = true;
        else if (inputName === 'registerPassword') isRegisterPasswordFocused.value = true;
        else if (inputName === 'confirmPassword') isConfirmPasswordFocused.value = true;
      };
  
      const blurInput = (inputName) => {
        if (inputName === 'email') isEmailFocused.value = false;
        else if (inputName === 'password') isPasswordFocused.value = false;
        else if (inputName === 'registerEmail') isRegisterEmailFocused.value = false;
        else if (inputName === 'registerPassword') isRegisterPasswordFocused.value = false;
        else if (inputName === 'confirmPassword') isConfirmPasswordFocused.value = false;
      };
  
      // 로그인 처리
      const handleLogin = async () => {
        try {
          await authService.tryLogin(email.value, password.value);
          router.push('/');
        } catch (error) {
          alert('Login failed');
        }
      };
  
      // 회원가입 처리
      const handleRegister = async () => {
        try {
          await authService.tryRegister(registerEmail.value, registerPassword.value);
          toggleCard();
        } catch (error) {
          alert(error.message);
        }
      };
  
      return {
        isLoginVisible,
        email,
        password,
        registerEmail,
        registerPassword,
        confirmPassword,
        rememberMe,
        acceptTerms,
        isEmailFocused,
        isPasswordFocused,
        isRegisterEmailFocused,
        isRegisterPasswordFocused,
        isConfirmPasswordFocused,
        isLoginFormValid,
        isRegisterFormValid,
        toggleCard,
        focusInput,
        blurInput,
        handleLogin,
        handleRegister
      };
    }
  };
  </script>
  
  <style scoped>
  /* 기존 CSS 코드 그대로 사용 */
  :root {
    --container-start-x: -50%;
    --container-end-x: -90%;
    --container-start-y: -58%;
    --container-end-y: -42%;
    --container-start-color: #ECECEC;
    --container-end-color: #100f0f;
  }
  .bg-image {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('https://images.unsplash.com/photo-1507041957456-9c397ce39c97?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    background-size: cover;
    background-position: center;
  }
  
  /* 나머지 CSS 코드 그대로 붙여넣기 */
  </style>
  
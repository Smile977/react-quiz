import React, {Component} from 'react'
import classes from './Auth.module.css'
import Button from "../../componesnts/UI/Button/Button"
import Input from "../../componesnts/UI/Input/Input"
import is from 'is_js'

export default class Auth extends Component {

    state = {
        isFormValid: false,
        formControls: {
            email: {
                value: '', // значение из input
                type: 'email',
                label: 'Email',
                errorMessage: 'Введите коректный email',
                valid: false, // поле прошло проверку если true
                touched: false, // если на поле нажимали то true
                validation: { //валидация по этим значениям
                    required: true, // не пустое
                    email: true
                }
            },
            password: {
                value: '',
                type: 'password',
                label: 'Пароль',
                errorMessage: 'Введите коректный пароль',
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 6
                }
            }
        }
    }

    loginHandler = () => {}

    registerHandler = () => {}

    submitHandler = event => {
        event.preventDefault()
    }

    validateControl(value, validation) { //проверка введенного значения в поле
        if (!validation) { // если мы не передали валидацию то нам не нужно проверять поле
            return true
        }

        let isValid = true

        if (validation.required) { //валидация что поле не пустое
            isValid = value.trim() !== '' && isValid
        }

        if (validation.email) { //валидация на email
            isValid = is.email(value) && isValid // проверка через библиотеку is_js
        }

        if (validation.minLength) { //валидация на мин кол-во символов
            isValid = value.length >= validation.minLength && isValid
        }

        return isValid
    }

    onChangeHandler(event, controlName) {
        //создание копии state для дальнейшего изменения при правильных полях
        const formControls = {...this.state.formControls}
        const control = {...formControls[controlName]}

        control.value = event.target.value
        control.touched = true
        control.valid = this.validateControl(control.value, control.validation)

        formControls[controlName] = control

        // Проверка валидации формы
        let isFormValid = true

        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })

        this.setState({
            formControls, isFormValid
        })
    }

    renderInputs() {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]
            return (
                <Input
                    key={controlName + index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    label={control.label}
                    sholdValidate={!!control.validation}
                    errorMessage={control.errorMessage}
                    onChange={event => this.onChangeHandler(event, controlName)}
                />
            )
        })


    }

    render() {
        return (
            <div className={classes.Auth}>
                <div>
                    <h1>Авторизация</h1>

                    <form onSubmit={this.submitHandler} className={classes.AuthForm}>

                        {this.renderInputs()}

                        <Button
                            type="success"
                            onClick={this.loginHandler}
                            disabled={!this.state.isFormValid}
                        >
                            Войти
                        </Button>
                        <Button
                            type="primary"
                            onClick={this.registerHandler}
                            disabled={!this.state.isFormValid}
                        >
                            Зарегистрироваться
                        </Button>
                    </form>

                </div>
            </div>
        )
    }
}

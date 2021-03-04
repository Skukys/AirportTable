import {request} from './api.js';

window.app = new Vue({
    data() {
        return {
            flights: [],
            createFlight: false,
            change: false,
            changeShow: false,
            changeId: null,
            changeGate: null,
            changeStatus: 'on-time',
            changeDelay: null,
            createData: {
                flight: null,
                route: null,
                departure_time: null,
                departure_date: null,
            },
            date: null,
            time: null,
            lang:'ru'
        }
    },
    el: '#app',
    mounted() {
        this.changeTable()
    },
    methods: {
        changeTable(){
            this.getFlights()
            setInterval(()=> {
                this.lang === 'ru' ? this.lang = 'en' : this.lang ='ru'
                this.getFlights()
            },5000)
            setInterval(()=>{
                let date = new Date()
                this.date = date.getFullYear() + ':' + ("0" + ((new Date()).getMonth())).slice(-2) + ':' + ("0" + ((new Date()).getMonth())).slice(-2)
                this.time = ("0" + ((new Date()).getHours())).slice(-2) + ':' + ("0" + ((new Date()).getMinutes())).slice(-2)
            },1000)
        },
        async getFlights() {
            let res = await request('GET', '/show')
            let fl = res.json.body.flights
            for (let key in fl) {
                fl[key].map(val => {
                    if (val.delay) val.delay = this.getDelay(val.departure_time, val.delay)
                    if (val.status) val.status = this.getStatus(val.status)
                })
            }
            this.flights = fl
        },
        getDelay(time, delay) {
            let timeData = time.split(':')
            let delayData = delay.split(':')
            let h = Number(timeData[0]) + Number(delayData[0])
            let min = Number(timeData[1]) + Number(delayData[1])
            if (min >= 60) {
                min = min - 60
                h++
            }
            if (min < 10) min = '0' + `${min}`
            if (h < 10) h = '0' + `${h}`
            return h + ':' + min
        },
        getStatus(status) {
            if (status === 'check-in') return {en: 'Check in', ru: 'Регистрация', color: 'yellow'}
            if (status === 'on-time') return {en: 'On time', ru: 'По рассписанию', color: 'green'}
            if (status === 'gate-closing') return {en: 'Gate closing', ru: 'Регистрация завершена', color: 'green'}
            if (status === 'delayed-until') return {en: 'Delayed until', ru: 'Задержка до', color: 'orange'}
            if (status === 'boarding') return {en: 'Boarding', ru: 'Посадка', color: 'green'}
        },
        getFlight(id) {
            this.change = true
            this.changeId = id
        },
        async changeFlight() {
            if (this.changeDelay && this.changeGate && this.changeStatus) {
                let response = {
                    delay: this.changeDelay,
                    status: this.changeStatus,
                    gate: this.changeGate,
                }
                let res = await request('POST', `/edit/${this.changeId}`, response)

                this.changeStatus = null
                this.changeGate = null
                this.changeDelay = null
                this.change = false
            }
        },
        close() {
            this.change = false
            this.createFlight = false
        },
        async newFlight() {
            if (this.createData.route && this.createData.departure_date && this.createData.departure_time && this.createData.flight) {
                let res = await request('POST', '/add', this.createData)

                this.createData.route = null
                this.createData.departure_date = null
                this.createData.departure_time = null
                this.createData.flight = null
                this.createFlight = false
            }
        }
    }
})
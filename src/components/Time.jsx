import React, { Component } from 'react'
import propTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

export default class Time extends Component {
    componentDidMount() {
        var scroll = document.getElementsByClassName('scroll')
        for (var i=0; i<scroll.length; i++){
            var select = scroll[i].getElementsByClassName('select')
            for (var j=0; j<select.length; j++){
                select[j].scrollIntoView()
            }
        }
    }

    renderHour(select,min,max) {
        const { disabled } = this.props
        var d = disabled.indexOf('hour')!=-1
        const selectDate = new Date(select.year,select.month-1,select.date)
        const minDate = new Date(min.year,min.month-1,min.date)
        const maxDate = new Date(max.year,max.month-1,max.date)
        var hours = []
        for(var hr=1;hr<=12;hr++){
            if(selectDate-minDate>0 && maxDate-selectDate>0){
                hours.push({hr, enable:d? false: true})
            }
            else{
                if(selectDate-minDate==0 && maxDate-selectDate>0){
                    hours.push({hr, enable:d? false: (((select.ampm-min.ampm)*12+min.hour)%12)<=hr})
                }
                else if(selectDate-minDate>0 && maxDate-selectDate==0){
                    hours.push({hr, enable:d? false: (((max.ampm-select.ampm)*12+max.hour)%12)>=hr})
                }
                else{
                    hours.push({hr, enable:false})
                }
            }
        }
        return hours
    }

    renderMin(select,min,max) {
        const { disabled } = this.props
        var d = disabled.indexOf('min')!=-1
        const selectHour = new Date(select.year,select.month-1,select.date,select.hour+(select.ampm*12))
        const minHour = new Date(min.year,min.month-1,min.date,min.hour+(min.ampm)*12)
        const maxHour = new Date(max.year,max.month-1,max.date,max.hour+(max.ampm)*12)
        var mins = []
        for(var minute=0;minute<60;minute++){
            if(selectHour-minHour>0 && maxHour-selectHour>0){
                mins.push({minute, enable:d? false: true})
            }
            else{
                if(selectHour-minHour==0){
                    mins.push({minute, enable:d? false: min.min<=minute})
                }
                else if(maxHour-selectHour==0){
                    mins.push({minute, enable:d? false: max.min>=minute})
                }
                else{
                    mins.push({minute, enable:false})
                }
            }
        }
        return mins
    }

    renderAMPM(select,min,max) {
        const { disabled } = this.props
        var d = disabled.indexOf('ampm')!=-1
        if(d){
            ampm = {am:false, pm:false}
        }
        else{
            const selectDate = new Date(select.year,select.month-1,select.date)
            const minDate = new Date(min.year,min.month-1,min.date)
            const maxDate = new Date(max.year,max.month-1,max.date)
            var ampm = {am:false, pm:false}
            if(selectDate-minDate>=0 && maxDate-selectDate>=0){
                ampm = {am:true, pm:true}
            }
            if(selectDate-minDate==0){
                ampm.am = min.ampm==0
            }
            if(maxDate-selectDate==0){
                ampm.pm = max.ampm==1
            }
        }
        return ampm
    }

    render() {
        const { select, selectDay, max, min, disabled } = this.props
        const ampm = this.renderAMPM(select,min,max)
        return (
            <div className="timebox">
                <div className="hour scroll">
                    {
                        this.renderHour(select,min,max).map(i => 
                            i.enable?
                            <div className={(select.hour == i.hr ? "select " : "") + "timeitem onclick hover"} key={i.hr} onClick={() => selectDay(null, null, null, i.hr)}>{i.hr}</div>
                            :<div className={(select.hour == i.hr ? "select " : "") + "timeitem disabled-timeitem"} key={i.hr}>{i.hr}</div>
                        )
                    }
                </div>
                
                <div className="minute scroll">
                    {
                        this.renderMin(select,min,max).map(i =>
                            i.enable?
                            <div className={(select.min == i.minute ? "select " : "") + "timeitem onclick hover"} key={i.minute} onClick={() => selectDay(null, null, null, null, i.minute)}>{i.minute}</div>
                            :<div className={(select.min == i.minute ? "select " : "") + "timeitem disabled-timeitem"} key={i.minute}>{i.minute}</div>
                        )
                    }
                </div>

                <div className="ampm scroll">
                    {
                        ampm.am?
                            <div className={(select.ampm == 0 ? "select " : "") + "timeitem onclick hover"} onClick={() => selectDay(null, null, null, null, null, 0)}><FormattedMessage id='datetime.am' defaultMessage='上午'></FormattedMessage></div>
                            :<div className={(select.ampm == 0 ? "select " : "") + "timeitem disabled-timeitem"}><FormattedMessage id='datetime.am' defaultMessage='上午'></FormattedMessage></div>
                    }
                    {
                        ampm.pm?
                            <div className={(select.ampm == 1 ? "select " : "") + "timeitem onclick hover"} onClick={() => selectDay(null, null, null, null, null, 1)}><FormattedMessage id='datetime.pm' defaultMessage='下午'></FormattedMessage></div>
                            :<div className={(select.ampm == 1 ? "select " : "") + "timeitem disabled-timeitem"}><FormattedMessage id='datetime.pm' defaultMessage='下午'></FormattedMessage></div>
                    }
                    
                </div>
            </div>
        )
    }
}

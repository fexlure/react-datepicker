# React DatePicker

### Simple datepicker on React

![](https://i.ibb.co/wLKhJRC/tg-image-2248843087.jpg)


## Installation
```
npm install @voytenkodev/react-datepicker
```
Or via yarn:

```
yarn add @voytenkodev/react-datepicker
```

```js
import { useState } from 'react'
import { CalendarPicker } from '@voytenkodev/react-datepicker'
// if need a default styles
import '@voytenkodev/react-datepicker/dist/style.css'

function App() {
	const [date, setDate] = useState<Date>();
	
	return (
		<CalendarPicker value={date} onChange={setDate} />
	)
}
```

Use with react-hook-form
```js
import { CalendarPicker } from 'react-datepicker'
import { useFormContext, Controller } from 'react-hook-form'
// if need a default styles
import '@voytenkodev/react-datepicker/dist/style.css'

function App() {
        const { control } = useFormContext()
	return (
            <Controller
                control={control}
                render={({ field: { onChange, value }}) => (
                <CalendarPicker
                    value={value}
                    onChange={onChange}
                />
            )}
            name={'your-key'}
        />
	)
}
```

Property                | type          | Values                 | Description                                              
------------------------|---------------|------------------------|----------------------------------------------------------
locale                  | string        | "en", "ru", "fr"       | Changed language and day of started week. Default: en    
type                    | String        | "month", "full"        | Type of returned date (when type of month, days is not show) 
onChange*               | Date          | any date               | Returned date or null (if reset)   
showFormat              | string        | DD.MM.YYYY, YYYY/MM/DD | Show format in calendar, but returned anyway date         
value*                  | Date          | any date               | undefined               | Show date or placeholder                                 
placeholder             | string        | any string             | default placeholder it's returnedFormat                  
globalStyles            | CSSProperties | any styles             | Styles for global container                              
calendarStyles          | CSSProperties | any styles             | Styles for calendar container                            
mainColor               | string        | any color              | Color is active date. Default: #2F8DB3                   
min                     | string        | none, "2024-04-12"     | Min date for select. Default: none                       
max                     | string        | none, "2024-05-12"     | Max date for select. Default: none                       
showResetButton         | boolean       | true/false             | Hide button "Reset". Default: false                       
alwaysVisible           | boolean       | true/false             | Show callendar all time. Default: false                       

### Todos

- Tests
- Documentation


# Please create a discussion if you have any comments or suggestions, thank you.


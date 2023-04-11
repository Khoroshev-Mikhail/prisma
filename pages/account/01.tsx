import Search from 'components/UI/Search'
import { Label, Select, Spinner, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
const ara = [{"id":225075,"bp":null,"name":"MasterEmaco N1100 Tix W/Мастер Эмако N1100 Тикс W Сухая ремонтная смесь (30)кг.","acc":"10.01","acc_desc":null,"stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","mrp":"Чертков Александр Валерьевич","unit":"кг","qty":"3 203"},{"id":225076,"bp":null,"name":"Арматура АIII (А400)d18*11700мм","acc":"10.01","acc_desc":null,"stock":"НЗП Внутриплощадочный склад № 1","mrp":"","unit":"т","qty":"1,152"},{"id":225077,"bp":null,"name":"Арматура АIII (А400)d22*11700мм","acc":"10.01","acc_desc":null,"stock":"НЗП Внутриплощадочный склад № 1","mrp":"","unit":"т","qty":"0,18"},{"id":225078,"bp":null,"name":"Бокс с прозрачной крышкой КМПн 2/4 для 4-х авт. выкл. наружной установки (БК 2)","acc":"10.01","acc_desc":null,"stock":"Внутриплощадочный склад № 3","mrp":"Сюй Вэньси","unit":"шт","qty":"5"},{"id":225079,"bp":null,"name":"Дюбель 3Д-1 с отверстием 38мм","acc":"10.01","acc_desc":null,"stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","mrp":"Чертков Александр Валерьевич","unit":"шт","qty":"791"},{"id":225080,"bp":null,"name":"Дюбель ДРП-1,1","acc":"10.01","acc_desc":null,"stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","mrp":"Чертков Александр Валерьевич","unit":"шт","qty":"1 438"},{"id":225081,"bp":null,"name":"Заглушка к дюбелю 3Д-1 с уплотнительным кольцом","acc":"10.01","acc_desc":null,"stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","mrp":"Чертков Александр Валерьевич","unit":"шт","qty":"791"},{"id":225082,"bp":null,"name":"Каркас арматурный плоский Кр7 РД 191209-1-КЖ1.1","acc":"10.01","acc_desc":null,"stock":"Строительный участок - г. Благовещенск","mrp":"Яковенко Дмитрий Станиславович","unit":"шт","qty":"8 122"},{"id":225083,"bp":null,"name":"Клей резиновый ТюбингГлю TG-300 (WS)","acc":"10.01","acc_desc":null,"stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","mrp":"Чертков Александр Валерьевич","unit":"кг","qty":"2 914"},{"id":225084,"bp":null,"name":"Крышка для отверстия 38мм к дюбелю 3Д-1","acc":"10.01","acc_desc":null,"stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","mrp":"Чертков Александр Валерьевич","unit":"шт","qty":"791"},{"id":225085,"bp":null,"name":"Лента защитная (ЛЗУС 25х12)","acc":"10.01","acc_desc":null,"stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","mrp":"Чертков Александр Валерьевич","unit":"пог. м","qty":"4 199"},{"id":225086,"bp":null,"name":"Линамикс Р жидкий  РБУ","acc":"10.01","acc_desc":null,"stock":"Склад: пос. Краснопахорское, кв-л. 147, уч. Вл. 1","mrp":"Платонов Олег Александрович","unit":"т","qty":"4,184"},{"id":225087,"bp":null,"name":"Лист Г/К 8.0 1500х 6000 ст3сп/пс5 (ГОСТ 14637-89,НЛМК)","acc":"10.01","acc_desc":null,"stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","mrp":"Чертков Александр Валерьевич","unit":"т","qty":"5,5"},{"id":225088,"bp":null,"name":"Лист Г/К 8.0 1500х 6000 ст3сп/пс5 (ГОСТ 14637-89,НЛМК)","acc":"10.01","acc_desc":null,"stock":"НЗП Строительный участок Мамыри (Тюленева)","mrp":"","unit":"т","qty":"6,881"},{"id":225089,"bp":null,"name":"ОБВ (опора быстро возводимая)","acc":"10.01","acc_desc":null,"stock":"Отдел энергетика Строит уч №2 (ОП Москва-Казань)","mrp":"Макаренко Михаил Александрович","unit":"шт","qty":"3"},{"id":225090,"bp":null,"name":"Обратный клапан к дюбелю 3Д-1","acc":"10.01","acc_desc":null,"stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","mrp":"Чертков Александр Валерьевич","unit":"шт","qty":"791"},{"id":225091,"bp":null,"name":"Опора быстро возмодимая № 3 (ОБВ) 6 м","acc":"10.01","acc_desc":null,"stock":"АБЗ Строит уч№4 (ОП УС№3 Москва-Казань с.Яново)","mrp":"Шилов Алексей Леонидович","unit":"шт","qty":"2"},{"id":225092,"bp":null,"name":"Полипласт ФОРМ тип 3 жидкий","acc":"10.01","acc_desc":null,"stock":"РБУ Бетонный з-д Строит уч №3(ОП УС3Москва-Казань)","mrp":"Терехин Владимир Анатольевич","unit":"т","qty":"1,72"},{"id":225093,"bp":null,"name":"Система выравнивания плитки Зажим Флажок 1,4 мм 1уп/300шт (БК 1)","acc":"10.01","acc_desc":null,"stock":"Внутриплощадочный склад № 1","mrp":"Белайчук Раиса Леонидовна","unit":"упак","qty":"27"},{"id":225094,"bp":null,"name":"Система выравнивания плитки Клин д/зажима Флажок/Кольцо/Квадрат 1уп/50шт (БК 1)","acc":"10.01","acc_desc":null,"stock":"Внутриплощадочный склад № 1","mrp":"Белайчук Раиса Леонидовна","unit":"упак","qty":"160"},{"id":225095,"bp":null,"name":"Труба гофрированная 110 (БК 2)","acc":"10.01","acc_desc":null,"stock":"Внутриплощадочный склад № 3","mrp":"Сюй Вэньси","unit":"пог. м","qty":"6"},{"id":225096,"bp":null,"name":"Шайба из листа 12мм 80х80 с отверстием д-27мм/Ст.3/без зачистки,без покраски  (Б.Камень якоря)","acc":"10.01","acc_desc":null,"stock":"Внутриплощадочный склад № 3","mrp":"Сюй Вэньси","unit":"шт","qty":"16"},{"id":225097,"bp":null,"name":"Шайба из листа 20мм 80х80 с отверстием д-27мм/Ст.3/без зачистки,без покраски  (Б.Камень якоря)","acc":"10.01","acc_desc":null,"stock":"Внутриплощадочный склад № 3","mrp":"Сюй Вэньси","unit":"шт","qty":"18"},{"id":225098,"bp":null,"name":"Штанга направляющая 40х500","acc":"10.01","acc_desc":null,"stock":"Склад: пос. Краснопахорское, кв-л. 147 (ЖБИ)","mrp":"Чертков Александр Валерьевич","unit":"шт","qty":"100"}]
let ara2 = []
for(let i = 0; i <= 1000; i++){
    ara2.push(...ara)
}

export default function Account01({ acc } : { acc: string }){
    useEffect(()=>{
        // fetch('http://localhost:3000/api/osv', {
        //     method: 'POST',
        //     body: JSON.stringify(ara2)
        // })
        console.log(ara2)
    },[])

    return (
        <div className="grid grid-cols-12">
            
        </div>
    )
}

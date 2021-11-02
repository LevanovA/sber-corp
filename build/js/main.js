//Данный файл содержит общие фунции для стандартных операций над данными

//Убирает все пробелы внутри строки или числа
function deleteSpacesInValue(value) {
    let newString;
    newString = value.split(' ').join('');

    return newString
}

//Удаляет пробелы и значения после последнего пробела
function deleteSingAfterSpace(value) {
    let newString;
    newString = value.split(' ').slice(0, -1).join('')

    return newString
}

//Преобразует дату из маски формата dd.mm.yyyy в формат ISO yyyy-mm-dd
function convertsDateToIsoFormat(date) {
    let newDate;
    newDate = date.split('.').reverse().join('-')

    return newDate
}

//Собирает выбранные значения чекбоксов в строку для отправки на бэк
function collectsCheckedCheckboxToString (checkboxes) {
    let checkboxCollection = []
    checkboxes.map(function () {
        if ($(this).is(':checked')) {
            checkboxCollection.push($(this).val())
        }
    })

    checkboxCollection.join();

    return checkboxCollection
}

//Запускает прокрутку счетчика
function scrollCounter (counter) {
    counter.prop('Counter',0).animate({
        Counter: counter.text()
    }, {
        duration: 500,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }));
        }
    });
}

//Вызывает отправку формы если есть атрибут data-submit и он равен submit
function hasDataAttrSubmit (elem) {
    if (elem.attr('data-submit') !== undefined && elem.attr('data-submit') === 'submit') {
        elem.parents('.form').trigger('submit');
    }
}

//Возвращает функцию, которая, пока она продолжает вызываться, не будет запускаться.
//Она будет вызвана один раз через N миллисекунд после последнего вызова.
//Если передан аргумент `immediate` (true), то она запустится сразу же при первом запуске функции.
//Пример реализации в файле cell-input строка 11
function debounce(func, wait, immediate) {
    let timeout;

    return function executedFunction() {
        const context = this;
        const args = arguments;

        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        const callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
};

//Расчет суммы НДФЛ
function calculationNdfl(prem, installment, termPeriod) {
    let ndfl;
    let ndflPerYear;

    if (installment === 0) {
        ndflPerYear = (prem * 0.13) > 15600 ? 15600 : (prem * 0.13)
        ndfl = ndflPerYear

        return ndfl
    } else {
        ndflPerYear = (prem * installment * 0.13) > 15600 ? 15600 : (prem * installment * 0.13)
        ndfl = ndflPerYear * termPeriod

        return ndfl
    }
}

//Показать прелоадер
function showPreloader() {
    const preloader = $('.preloader');

    preloader.show();
}

//Скрыть прелоадер
function hidePreloader() {
    const preloader = $('.preloader');

    preloader.hide();
}

//Вывод ошибки формы с бэка и если нужно, блокировка кнопки отправки. Если нужно просто показать ошибки, то вызывать без параметра button
function showErrorFormAndDisabledButton(status, errorBlock, errorText, button) {
    status === 200 ? errorBlock.slideUp() : errorBlock.html(errorText).slideDown();
    button !== undefined && (status === 200 ? button.attr('disabled', false) : button.attr('disabled', true))
}

//Получает кол-во полных лет прошедших с определенной даты. Дату можно указывать в формате (yyyy-mm-dd)
function getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

//Перевод строки в вид с первой большой и остальными маленькими буквами (надо потестить)
function getNormalText(str) {
    str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
}

//Определяет процент от числа
function calculatePercentSum(number, percent) {
    return (Number(number) * Number(percent))/100
}

//Добавляет проценты к числу
function addsPercentToNumber(number, percent) {
    return Number(number) + calculatePercentSum(number, percent)
}

//Десятичные разделители для input и добавление знака рубля
function addSeparatorAndSing (elem) {
    const value = elem.val();
    const number = value.split(' ').join('').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    const buffer = elem.parent('.cell__data').find('.cell__sign-buffer');
    const sign = elem.parent('.cell__data').find('.cell__sign');
    let ident;

    //Показываем или скрываем денежный знак
    value.length ? sign.show() : sign.hide()

    //Считаем ширину вводимого числа в буферном блоке
    ident = buffer.text(number).width() + 28

    //Останавливаем увеличение отступа если значение больше чем ширина инпута
    if (ident >= (elem.width() + 28)) {
        ident = elem.width() + 28
    }

    //Добавляем разделители в введенное число
    elem.val(number)

    //Добавляем нужный отступ для знака денежного знака
    sign.css('left', ident)
}

'use strick'

function showModalWindow (button) {
    const popupName = button.attr('data-popup-name');
    const popup = $(`#${popupName}`);
    const popupClose = popup.find('.popup__close');
    const popupActive = $('.popup.popup--active');

    console.log(111, popupName)
    //Проверяем, есть ли уже открыте popup и если да, то закрываем его
    if (popupActive.length) {
        closeModalWindow(popupActive, false);
    } else {
        blockBody();
    }

    //Открываем popup
    popup.addClass('popup--active');

    //Закрытие popup на крестик
    popupClose.on('click', function () {
        closeModalWindow(popup);
    })

    //Закрытие popup при клике на темную область
    popup.on('click', function (e) {
        if (!e.target.closest('.popup__content')) {
            closeModalWindow(popup);
        }
    })

    //Закрытие popup при нажатии esc
    $(document).on('keydown', function (e) {
        if (e.keyCode === 27) {
            closeModalWindow(popup);
        }
    })
}

//Закрывает попап и удаляет обработчик прослушки нажатия клавиш клавиатуры
function closeModalWindow(popup, doUnBlockBody = true) {
    if (doUnBlockBody) {
        unBlockBody();
        popup.removeClass('popup--active');
        $(document).off('keydown');
    } else {
        popup.removeClass('popup--active');
    }
}

//Блокируем body с удалением скролла
function blockBody() {
    const body = document.body;
    const blockPaddingValue = window.innerWidth - body.clientWidth + 'px';

    body.style.overflow = 'hidden';
    body.style.paddingRight = blockPaddingValue;
}

//Разблокирует body
function unBlockBody() {
    const body = document.body;

    //Разблокируем боди после окончания анимации
    setTimeout(function () {
        body.style.overflow = 'visible';
        body.style.paddingRight = '0';
    }, 500);
}

//Вызов popup
$('button[data-popup-name], a[data-popup-name]').on('click', function () {

    showModalWindow($(this));
})

'use strict';

$(document).ready(function(){
    $('.slider').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
});

//# sourceMappingURL=main.js.map

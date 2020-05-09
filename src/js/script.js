//tabs
window.addEventListener('DOMContentLoaded', function() {

'use strict';
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');
        
    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');

        }
    }

    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', function(event) {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for(let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
        
    });

    //timer
    let deadline = '2020-06-30';

    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
        seconds = Math.floor((t/1000) % 60),
        minutes = Math.floor((t/1000/60) % 60),
        hours = Math.floor((t/(1000*60*60) % 24)),
        days = Math.floor((t/(1000*60*60*24)));

        return {
            'total' : t,
            'hours' : hours,
            'minutes': minutes,
            'seconds': seconds,
            'days': days
        };
    }
    //функция выставляет и запускает часы
    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            seconds = timer.querySelector('.seconds'),
            minutes = timer.querySelector('.minutes'),
            hours = timer.querySelector('.hours'),
            days = timer.querySelector('.days'),
            timeInterval = setInterval(updateClock, 1000);
            
    

        //функция обновляет каждую секунду
        function updateClock() {
            let t = getTimeRemaining(endtime);
            
            //ведущие нули
            function addZero(num) {
                if (num <= 9) {
                    return "0" + num;
                } else return num;
            }
            
            
            hours.textContent = addZero(t.hours);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);
            days.textContent = addZero(t.days);

         //чтобы не уходило в минус           
        if(t.total <= 0) {
            clearInterval(timeInterval);
            hours.textContent = "00";
            minutes.textContent = "00";
            seconds.textContent = "00";
            days.textContent = "00";
        }
    }
}
    setClock('timer', deadline);

    //modal

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    more.addEventListener('click', function() {
        overlay.style.display = "block";
        this.classList.add('more-splash');          //classList.add добавляет/удаляет класс class анимация
        document.body.style.overflow = 'hidden';    //блокирует скролл при открытом окне
    });

    close.addEventListener('click', function() {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
    });

    // form
    let message = {
        loading: 'загрузка...',
        success: 'Спасибо! мы скоро с вами свяжемся...',
        failure: 'что то пошло не так...'
    };

    let form = document.querySelector('.main-form'),
        input = document.getElementsByTagName('input'), //обрабочик событий вешается именно на форму, а не на кнопку
        statusMesage = document.createElement('div');

        statusMesage.classList.add('status');
        
        form.addEventListener('submit', function(event){    //навешивать обработчик именно на форму, а не на кнопку
            event.preventDefault(); //отменяет стандартное поведение браузера, страница не отправляет запрос, будет реализовано ajax-om
            form.appendChild(statusMesage);

            let request = new XMLHttpRequest();
            request.open('POST', 'server.php'); //настройка запроса к серверу
            //request.setRequestHeader('Content-Type', 'application/x-www-form-urlemcoded'); //заголовки http запроса(), контенк который будет отправлен на сервер будет содержать данные из формы
            //чтобы отправить json
            request.setRequestHeader('content-type', 'application/json; charset=utf-8'); //заголовок запроса, сейчас будут json файлы

            let formData = new FormData(form); //сначала при помощи объекта formData, получаем всё что ответил пользователь в форме
            let obj = {}; //потом создаем новый объект в который помещаем все эти данные
            formData.forEach(function(value, key) { //превратили объект formData в обычный читаемый объект
                obj[key] = value; //в оюъекте obj лежат все данные которые пользователь ответил
            });
            let json = JSON.stringify(obj); //stringify превращает обычные объекты js в json формат
            request.send(json); //send Открывает запрос, отправляет на сервер и как body передаем formData

            request.addEventListener('readystatechange', function() {
                if (request.readyState < 4 ) {
                    statusMesage.textContent = message.loading;
                } else if(request.readyState === 4 && request.status == 200) {
                    statusMesage.textContent = message.success;
                } else {
                    statusMesage.textContent = message.failure;
                }
            });
//очистить форму
            for ( let i = 0; i < input.length; i++) {
                input[i].value = "";
            }
    });
});


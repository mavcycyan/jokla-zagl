$(document).ready(function(){
    localStorage.removeItem("quiz");

    var curId = 0;

    $('.js-btnMdl').click(function(e){
        e.preventDefault()
        $.ajax({
            url: "../quiz/quiz.php",
            method: "POST",
            dataType: "json"
        }).done(function(res){
            var html = mdlHtml(res)
            $('.js-mdlWrap').html(html)
            $('.js-modal').fadeIn()
        })
    })

    $('body').on('change', '.js-chbMdl', function(){
        curId = curId + 1

        var name = $(this).attr('name');

        if (!localStorage['quiz']) {
            var obj = [
                {
                    name: $(this).attr('name'),
                    value: $(this).next().text()
                }
            ]
            var serialObj = JSON.stringify(obj);
        } else {
            var localSt = JSON.parse(localStorage.getItem("quiz"))
            var obj = {
                name: $(this).attr('name'),
                value: $(this).next().text()
            }
            localSt.push(obj)
            var serialObj = JSON.stringify(localSt);
        }
        localStorage.setItem('quiz', serialObj);
        $.ajax({
            url: "../quiz/quiz.php",
            method: "POST",
            data: { id: curId},
            dataType: "json"
        }).done(function(res){
            if (res.wasLast) {
                var html = generateForm()
                $('.js-mdlWrap').html(html)
            } else {
                var html = mdlHtml(res)
                $('.js-mdlWrap').html(html)
            }
        })
    })

    $('.js-cls, .js-overlay').click(function(e){
        e.preventDefault()

        $('.js-modal').fadeOut()
        localStorage.removeItem("quiz");
        curId = 0
        setTimeout(function(){
            $('.js-mdlWrap').html('')
        }, 500)
    })

    $('body').on('click', '.js-mdlForm button', function(e){
        e.preventDefault()
        var form = $(this).closest('.js-mdlForm')
        var isValid = true


        form.find('[required]').removeClass('error').each(function(){
            if($(this).val() == '') {
                isValid = false
                $(this).addClass('error')
            }
            if($(this).attr('type') == 'email') {
                isValid = validateEmail($(this).val())
                if (isValid == false){
                    $(this).addClass('error')
                }
            }
        })

        if (isValid) {
            var serialObj = JSON.parse(localStorage.getItem("quiz"));
            $.ajax({
                url: "../quiz/mailPost.php",
                method: "POST",
                data: {
                    name: form.find('[name="name"]').val(),
                    email: form.find('[name="email"]').val(),
                    answers: serialObj
                }
            }).done(function(res){
                console.log(res)
                $('.js-mdlWrap').html('<div class="modal-top-ttl">Спасибо за заявку. Мы постараемся ответить Вам максимально быстро!</div>')
                localStorage.removeItem("quiz");
            })
        }
    })



    function mdlHtml(json) {
        var html = '<div class="modal-top">'
        html = html + '<div class="modal-top-ttl">Введите свои контактные данные, куда мы вышлем Вам ответ</div>'
        html = html + '</div>'
        html = html + '<div class="modal-quest-ttl">'+json.question+'</div>'
        html = html + '<div class="modal-answers">'
        for( var i = 0; i < json.answers.length; i++){
            html = html + '<div class="modal-col">'
            html = html + '<div class="modal-chb">'
            html = html + '<input type="radio" name="'+json.id+'" id="'+json.id+'-'+i+'" class="js-chbMdl">'
            html = html + '<label for="'+json.id+'-'+i+'">'+json.answers[i]+'</label>'
            html = html + '</div>'
            html = html + '</div>'
        }
        html = html + '</div>'
        return html
    }

    function generateForm() {

        var html = '<div class="modal-form-ttl">Перед отправкой ответьте на пару вопросов</div>'
        html = html + '<form action="" class="modal-form js-mdlForm">'
        html = html + '<div class="modal-form-input">'
        html = html + '<input type="text" name="name" placeholder="Ваше имя" required>'
        html = html + '</div>'
        html = html + '<div class="modal-form-input">'
        html = html + '<input type="email" name="email" placeholder="Ваш email" required>'
        html = html + '</div>'
        html = html + '<div class="modal-form-btn">'
        html = html + '<button type="submit">Получить коммерческое предложение</button>'
        html = html + '</div>'
        html = html + '</form>'
        return html
    }

    function validateEmail(email) {
        var pattern  = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern .test(email);
    }
})
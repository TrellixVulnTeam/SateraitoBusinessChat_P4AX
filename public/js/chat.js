$(function() {

    // var socket = io();
    // socket.emit("hearing",{
    //     user_email: user_email
    // });

    //TODO When loading main chat page, emit to check conversation list and unread message etc.

    socket.on("conversation ready",function (data) {
        var chat_info_message = "Conversation_id : "+ data.conversation_id +", member_list : " + data.member_list + ", organizer_email : " + data.organizer_email
        console.log("conversation ready");
        console.log(chat_info_message);

        if(data.member_list.split(",").indexOf(user_email) != -1 || user_email == data.organizer_email){
            $(".chat_info_message").text(chat_info_message);
        }




    });

    $("#send_message").on("click",function () {
        var message_text = $(".message_text").val();

        socket.emit("send message",{
            user_email: user_email,
            message_text : message_text
        })

    })

    socket.on("new message",function (data) {
        console.log("new message from "+data.user_email+". Content is: '" + data.message_text +"'.");
        $(".message_text").val("");

        var chat_line_html = "";
        chat_line_html += "<div class='chat_line'>";
        chat_line_html += "<a href='javascript:void(0)' class='chat_line_user'>"+data.user_email+"</a>";
        chat_line_html += "<p class='chat_line_message'>"+data.message_text+"</p>";
        chat_line_html += "</div>";

        $(".chat_wrapper").append(chat_line_html);


    });

    $("#start_new_chat").on("click",function () {
        var user_list_string = $("#chat_user_list").val();
        var organizer_email = $("#chat_organizer").val();

        //call create chat AJAX
        $.post("/create-chat",
            {
                member_list: user_list_string,
                organizer_email: organizer_email

            },
            function (data) {

                if (data.status == "not ok") {
                    alert("エラ発生");
                    return false;

                }else{
                    var conversation_id = data.conversation_id;
                    // Tell the server your username
                    socket.emit('start new conversation', {organizer_email: organizer_email, member_list: user_list_string, conversation_id: conversation_id});
                    $("#create_new_chat").modal("hide");
                }

            }
        );

    });



});






//Create new chat
function createNewChat(){
    $("#create_new_chat").modal("show");

}




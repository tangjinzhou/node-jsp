<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Hello,JSP</title>
    <link rel="stylesheet" type="text/css" href="./css/main.css"> 
</head>
<body>
<% 
    java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    java.util.Date currentTime = new java.util.Date();
    String str_date1 = formatter.format(currentTime); 
    String str_date2 = currentTime.toString(); 
%>
    <div class="mc">
        <h1>Hello,JSP!</h1>
        <h2><%=str_date2%></h2>
    </div>
    <script type="text/javascript" src="./js/main.js"></script>
</body>
</html>
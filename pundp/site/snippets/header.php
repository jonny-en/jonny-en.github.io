<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css?family=Merriweather:300,400,700,900|Roboto:300,400,700" rel="stylesheet">
  <title><?php echo $site->title()->html() ?> | <?php echo $page->title()->html() ?></title>
  <meta name="description" content="<?php echo $site->description()->html() ?>">
  <meta name="keywords" content="<?php echo $site->keywords()->html() ?>">

  <?php echo css('assets/css/main.css') ?>
  <?php echo css('assets/css/bootstrap.min.css') ?>
  <?php echo js('assets/js/bootstrap.min.js') ?>


</head>
<body>
  <header class="header cf" role="banner">
      <nav id="menu" class="navbar navbar-default navbar-fixed-top">
          <div class="container">
              <div class="navbar-header">
                  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                      <span class="sr-only">Toggle navigation</span>
                      <span class="icon-bar"></span>
                      <span class="icon-bar"></span>
                      <span class="icon-bar"></span>
                  </button>
                  <a class="navbar-brand" href="<?php echo url() ?>"> 
                      <img src="<?php echo url('assets/images/logo.svg') ?>" alt="<?php echo $site->title()->html() ?>" />
                  </a>
              </div>

              <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul class="nav navbar-nav navbar-right">
                  <?php foreach($pages->visible() as $p): ?>
                      <li>
                          <a href="<?php echo $p->url() ?>"><?php echo $p->title()->html() ?></a>
                      </li>
                  <?php endforeach ?>
                 </ul>
             </div>
          </div>
      </nav>
  </header>


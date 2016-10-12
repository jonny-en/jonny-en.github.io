<?php snippet('header') ?>

  <main class="main" role="main">
  <div class="slider">
  	<div id="slide_1" class="slide"></div>
    <div id="slide_2" class="slide"></div>
    <div class="vig-top"></div>
    <div class="vig-bottom"></div>
    <div class="container">
            <p class="small">P&amp;P Accessoires GmbH seit 1995</p>
            <div class="row">
                <div class="col-xs-11 hidden-xs col-sm-3">
                    <hr>
                </div>
                <div class="col-xs-11 col-sm-6">
                    <p>Partner der Parf&uuml;merie</p>
                </div>
                <div class="col-xs-11 hidden-xs col-sm-3">
                    <hr>
                </div>
            </div>
            <div class="welcome">Herzlich Willkommen!</div>
    </div>
  </div>

  <div class="about" >
  <div class="container"  >
    <div class="row">
        <div class="col-sm-6 left">   
         <!--<h1><?php echo $page->title()->html() ?></h1>-->
        <?php echo $page->text()->kirbytext() ?>
        </div>
        <?php if($image = $page->image('products.png')): ?>
        <div class="col-sm-6 right" style="background-image: url('<?php echo $image->url() ?>');">
        </div>
        <?php endif ?>
    </div>
    </div>
    </div>
    <div class="partner">
      <div class="container" >
          <div class="row">
              <div class="col">   
                  <span>Unsere Partner</span>

              <?php echo $page->partner()->kirbytext() ?>
              </div>
          </div>
      </div>    
    <div class="container">
        <div class="row">
            <div class="col-xs-4 col-md-2">
              <?php if($image = $page->image("partner-1.png")): ?>
              <img src="<?php echo $image->url() ?>">
              <?php endif ?>
            </div>
            <div class="col-xs-4 col-md-2">
              <?php if($image = $page->image("partner-1.png")): ?>
              <img src="<?php echo $image->url() ?>">
              <?php endif ?>
            </div>
            <div class="col-xs-4 col-md-2">
              <?php if($image = $page->image("partner-1.png")): ?>
              <img src="<?php echo $image->url() ?>">
              <?php endif ?>
            </div>
            <div class="col-xs-4 col-md-2">
              <?php if($image = $page->image("partner-1.png")): ?>
              <img src="<?php echo $image->url() ?>">
              <?php endif ?>
            </div>
            <div class="col-xs-4 col-md-2">
              <?php if($image = $page->image("partner-1.png")): ?>
              <img src="<?php echo $image->url() ?>">
              <?php endif ?>
            </div>
            <div class="col-xs-4 col-md-2">
              <?php if($image = $page->image("partner-1.png")): ?>
              <img src="<?php echo $image->url() ?>">
              <?php endif ?>
            </div>
        </div>
      </div>
      <div class="pictures">
      <div class="row">
        <div class="col-xs-4">  <?php if($image = $page->image("pic-2.jpg")): ?>
              <img src="<?php echo $image->url() ?>">
              <?php endif ?></div>
        <div class="col-xs-4">  <?php if($image = $page->image("pic-3.jpg")): ?>
              <img src="<?php echo $image->url() ?>">
              <?php endif ?></div>
               <div class="col-xs-4">  <?php if($image = $page->image("pic-4.jpg")): ?>
              <img src="<?php echo $image->url() ?>">
              <?php endif ?></div>
    </div>
      </div>
</div>
  </main>
<?php echo js('assets/js/main.js') ?>

<?php snippet('footer') ?>
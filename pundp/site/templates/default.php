<?php snippet('header') ?>

  <main class="main" role="main">

    <div class="text container">
      <?php echo $page->title()->html() ?>
      <?php echo $page->text()->kirbytext() ?>
    </div>

  </main>

<?php snippet('footer') ?>
<?php get_header(); ?>

<main>  
    <?php get_template_part('template-part/poster'); ?>
    <?php get_template_part('template-part/sub-nav'); ?>
    <div class="container">
        <div class="row">
            <div class="col-md-9 news-left">
                <div class="row pg-news-title-parrent">
                    <div class="col-md-12">
                        <h2>Tin tức</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">1</div>
                    <div class="col-md-4">2</div>
                    <div class="col-md-4">3</div>
                </div>
            </div>
            <div class="col-md-3 pg-news-right">
                <div class="row news-title-parrent">
                    <div class="col-md-12">
                        <h2>Danh mục</h2>
                    </div>
                    <div class="col-md-12">
                        <ul>
                            <li><a href="http://">a</a></li>
                            <li><a href="http://">b</a></li>
                            <li><a href="http://">c</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php get_footer();?>
<section id = "section-news" class="white-div">
    <div class="container">
        <div class="row ">
            <div class="div-title-header">
                <h2 class="margin0"><a class="title-header" href="<?= URL_ROOT?>">Tin mới</a></h2>
            </div>
            <div class="news-content">
                <?php 
                    $args_banner = array(
                        'post_type' => 'tintuc',
                        'post_status' => 'publish',
                        'posts_per_page' => '5'
                    );
                    $list_news = new WP_Query( $args_banner );
                ?>
                <?php
                    if ( $list_news->have_posts() ) :
                        while ( $list_news->have_posts() ) : $list_news->the_post();
                        $news_hits = 0;
                        $news_title = get_the_title();
                        $news_link_lk = get_the_permalink();
                        $news_description = get_the_excerpt();
                        $news_date_post = date('d-m-Y', strtotime(get_the_date()));
                ?>
                    <div class="news-main">
                        <div class="news-main-img">
                            <?php if ( has_post_thumbnail() ) {?>
                                <?php the_post_thumbnail('medium'); ?>
                            <?php } else{?>
                                <img src="<?php echo URL_IMG."/news.jpg"?>"/>
                            <?php } ?>
                        </div>
                        <div class="news-main-title">
                            <a href="<?= $news_link_lk;?>" title = "<?= $news_title?>" class="title-a"><?= $news_title?></a>
                        </div>
                        <div class="news-main-info info-box">
                            <i class="material-icons tiny">update</i>
                            <div class="newest-date"><?= $news_date_post;?></div>
                            <i class="material-icons tiny">remove_red_eye</i>
                            <div class="newest-views"><?= $news_hits;?></div>
                        </div>
                        <div class="news-main-expr exp-content">
                            <?= nl2br($news_description);?>
                        </div>
                    </div>
                <?php
                    $cnt_news++;
                    endwhile;
                ?>
                <?php
                        wp_reset_postdata();
                    endif;
                ?>
            </div>
        </div>
    </div>
    
</section>
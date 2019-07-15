<section id = "section-news">
    <div class="row">
        <div class="col s12 m8">
            <div class="row margin0-bottom box-title-left">
                <h2 class=" title-line-bottom margin-bottom-right color-a margin0"><a class="title-header" href="<?= URL_ROOT?>">Phật sự</a></h2>
            </div>
            <div class="row margin0-bottom">
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
                    <div class="newsest-content">
                        <div class="newsest-image">
                            <?php if ( has_post_thumbnail() ) {?>
                                <?php the_post_thumbnail('medium'); ?>
                            <?php } else{?>
                                <img src="<?php echo URL_IMG."/news.jpg"?>"/>
                            <?php } ?>
                        </div>
                        <div class="newsest-content-r">
                            <div class="newsest-title truncate"><a href="<?= $news_link_lk;?>" title = "<?= $news_title?>"><?= $news_title?></a></div>
                            <div class="newsest-expect">
                                <?= nl2br($news_description);?>
                            </div>
                            <div class="newest-info">
                                <i class="material-icons tiny">update</i>
                                <div class="newest-date">  <?= $news_date_post;?></div>
                                <i class="material-icons tiny">remove_red_eye</i>
                                <div class="newest-views"><?= $news_hits;?></div>
                            </div>
                        </div>
                        
                    </div>
                    
                <?php
                        endwhile;
                        wp_reset_postdata();
                    endif;
                ?>
            </div>
        </div>
        <div class="col s4">
            <div class="row ">
                <h2 class="color-a margin0 title-line-bottom "><a class="title-header" href="<?= URL_ROOT?>">Thông báo</a></h2>
            </div>
            <div class="row">
                Content thông báo
            </div>
        </div>
    </div>
</section>
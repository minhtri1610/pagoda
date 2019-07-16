<section id = "section-news">
    <div class="row">
        <div class="col s12 m8">
            <div class="row margin0-bottom box-title-left">
                <h2 class=" title-line-bottom margin-bottom-right color-a margin0"><a class="title-header" href="<?= URL_ROOT?>">Phật sự</a></h2>
            </div>
            <div class="news-content">
                <?php 
                    $args_banner = array(
                        'post_type' => 'tintuc',
                        'post_status' => 'publish',
                        'posts_per_page' => '5'
                    );
                    $list_news = new WP_Query( $args_banner );
                    $cnt_news = 0;
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
                    <?php if($cnt_news == 0){?>
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
                    <div class="news-right">
                    <?php } else {?>
                        <div class="news-item">
                            <div class="news-r-img">
                                <?php if ( has_post_thumbnail() ) {?>
                                    <?php the_post_thumbnail('medium'); ?>
                                <?php } else{?>
                                    <img src="<?php echo URL_IMG."/news.jpg"?>"/>
                                <?php } ?>
                            </div>
                            <div class="news-r-info">
                                <div class="news-r-title">
                                    <a href="<?= $news_link_lk;?>" title = "<?= $news_title?>" class="title-a"><?= $news_title?></a>
                                </div>
                                <div class="new-r-detail-info info-box">
                                    <i class="material-icons tiny">update</i>
                                    <div class="newest-date"><?= $news_date_post;?></div>
                                    <i class="material-icons tiny">remove_red_eye</i>
                                    <div class="newest-views"><?= $news_hits;?></div>
                                </div>
                            </div>
                        </div>
                    <?php }?>
                <?php
                    $cnt_news++;
                    endwhile;
                ?>
                    </div>
                <?php
                        wp_reset_postdata();
                    endif;
                ?>
            </div>
        </div>
        <div class="col s4">
            <div class="row ">
                <h2 class="color-a margin0 title-line-bottom "><a class="title-header" href="<?= URL_ROOT?>">Thông Báo</a></h2>
            </div>
            <div class="row">
            </div>
        </div>
    </div>
</section>
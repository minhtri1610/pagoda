<section id ="section-radio" class="grey-div">
    <div class="container">
        <div class="row">
            <div class="div-title-header">
                <h2 class="margin0">
                    <a title="" class="title-header" href="http://">Pháp âm</a>
                </h2>
            </div>
        </div>
        
        <div class="row video-content">
            <?php 
                $args_banner = array(
                    'post_type' => 'phapam',
                    'post_status' => 'publish',
                    'posts_per_page' => '6'
                );
                $list_videos = new WP_Query( $args_banner );
                $cnt_pam = 0;
            ?>
            <?php
                if ( $list_videos->have_posts() ) :
                    while ( $list_videos->have_posts() ) : $list_videos->the_post();
                    $video_hits = 0;
                    $video_title = get_field('tieu_de');
                    $video_link_youtube = get_field('link_youtubbe');
                    $video_thumnail = get_field('image_thumnail');
                    $video_date_post = date('d-m-Y', strtotime(get_the_date()));
                    $video_url = get_the_permalink();
            ?>
                <?php if($cnt_pam == 0){;?>
                    <div class="video-main">
                        <div class="video-content">
                            <?php echo do_shortcode('[embedyt]'.$video_link_youtube.'[/embedyt]');?>
                        </div>
                        <div class="video-title-content">
                            <a class="title-a" title="<?= $video_title;?>" href="<?= $video_url;?>"><?= $video_title;?></a>
                        </div>
                        <div class="newest-info video-post-info info-box">
                            <i class="material-icons tiny">update</i>
                            <div class="newest-date">  <?= $video_date_post;?></div>
                            <i class="material-icons tiny">remove_red_eye</i>
                            <div class="newest-views"><?= $video_hits;?></div>
                        </div>
                    </div>
                    <div class="video-right">
                <?php } else{ ?>
                    <div class="video-list">
                        <div class="video-thumnail">
                            <img src="<?= $video_thumnail?>" alt="">
                        </div>
                        <div class="video-title-right">
                            <a class="title-a" title="<?= $video_title;?>" href="<?= $video_url;?>"><?= $video_title;?></a>
                            <div class="video-rigth-info info-box">
                                <i class="material-icons tiny">update</i>
                                <div class="newest-date">  <?= $video_date_post;?></div>
                            </div>
                        </div>
                    </div>
                <?php }?>
                    
            <?php
                    $cnt_pam++;
                    endwhile;
                    
                    wp_reset_postdata();
                else:
            ?>
                </div>
                <p class="text-dranger">Không có bài đăng nào!</p>
            <?php        
                endif;
            ?>
        </div>
    </div>
</section>
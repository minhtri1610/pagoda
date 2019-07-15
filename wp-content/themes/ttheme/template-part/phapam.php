<section id ="section-radio">
    <div class="row row margin0-bottom box-title-left">
        <h2 class="color-a margin0 title-line-bottom">
            <a title="" class="title-header" href="http://">Pháp âm</a>
        </h2>
    </div>
    <div class="row video-content">
        <?php 
            $args_banner = array(
                'post_type' => 'phapam',
                'post_status' => 'publish',
                'posts_per_page' => '5'
            );
            $list_videos = new WP_Query( $args_banner );
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
            <div class="video-main">
                <div class="video-content">
                    <?php echo do_shortcode('[embedyt] https://www.youtube.com/watch?v=CrGU7KmVXRk[/embedyt]');?>
                </div>
                <div class="video-title-content">
                    <a title="<?= $video_title;?>" href="<?= $video_url;?>"><?= $video_title;?></a>
                </div>
                <div class="newest-info video-post-info">
                    <i class="material-icons tiny">update</i>
                    <div class="newest-date">  <?= $video_date_post;?></div>
                    <i class="material-icons tiny">remove_red_eye</i>
                    <div class="newest-views"><?= $video_hits;?></div>
                </div>
            </div>
            <div class="video-list">
                <div class="video-thumnail">
                    <img src="<?= $video_thumnail?>" alt="">
                </div>
                <div class="video-title-right">
                    <a title="<?= $video_title;?>" href="<?= $video_url;?>"><?= $video_title;?></a>
                    <div class="video-rigth-info">
                        <i class="material-icons tiny">update</i>
                        <div class="newest-date">  <?= $video_date_post;?></div>
                    </div>
                </div>
            </div>
        <?php
                endwhile;
                wp_reset_postdata();
            else:
        ?>
            <p class="text-dranger">Không có bài đăng nào!</p>
        <?php        
            endif;
        ?>
    </div>
</section>
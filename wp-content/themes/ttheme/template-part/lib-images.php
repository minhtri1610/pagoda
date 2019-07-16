<section id ="section-images">
    <div class="row row margin0-bottom box-title-left">
        <h2 class="color-a margin0 title-line-bottom">
            <a class="title-header" href="http://">Thư viện hình ảnh</a>
        </h2>
    </div>
    <div class="row">
        <div class="slick-images">
            <!-- Indicators -->
            <?php 
                $args_banner = array(
                    'post_type' => 'postercategory',
                    'post_status' => 'publish',
                    'posts_per_page' => '10'
                );
                $list_banner = new WP_Query( $args_banner );

            ?>
            <!-- The slideshow -->
            <?php
                if ( $list_banner->have_posts() ) :
                    while ( $list_banner->have_posts() ) : $list_banner->the_post();
                    $title = get_the_title();
                    $tmp_img_link = get_field('upload_image');
                    $tmp_post_link = get_field('link_post');
            ?>
                <div class ="banner-item">
                    <div class="banner-title">
                        <a title="<?= $title;?>" target = "blank" href="<?= $tmp_post_link;?>"><?= $title;?></a>
                    </div>
                    <img src="<?= $tmp_img_link;?>" alt="<?= $title;?>">
                </div>
            <?php
                    endwhile;
                    wp_reset_postdata();
                endif;
            ?>
        </div>
    </div>
</section>
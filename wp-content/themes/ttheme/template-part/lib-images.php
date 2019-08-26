<section id ="section-images" class="white-div">
    <div class="container">
        <div class="row">
            <div class="div-title-header ">
                <h2 class="margin0">
                    <a title="" class="title-header" href="http://">Thư viện hình ảnh</a>
                </h2>
            </div>
        </div>
        
        <div class="style-book row">
            <div class="style-book-cover col-md-4">
                <div class="book-img">
                    <img src="<?= URL_IMG.'/logo/logo-sm.png'?>" alt="">
                </div>
                <div class="book-content">
                    <div class="book-title">
                        <a href="http://">title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01</a></div>
                    <div class="newest-info video-post-info info-box">
                        <i class="material-icons tiny">update</i>
                        <div class="newest-date">  <?= 1?></div>
                        <i class="material-icons tiny">remove_red_eye</i>
                        <div class="newest-views"><?= 100?></div>
                    </div>
                </div>

            </div>
            <div class="style-book-list col-md-8">
                <div class="row b-list">
                    <div class="col-md-4">
                        <div class="b-item">
                            <div class="book-img">
                                <img src="<?= URL_IMG.'/logo/logo-sm.png'?>" alt="">
                            </div>
                            <div class="book-content">
                                <div class="book-title">
                                    <a href="http://">title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01</a></div>
                                <div class="newest-info video-post-info info-box">
                                    <i class="material-icons tiny">update</i>
                                    <div class="newest-date">  <?= 1?></div>
                                    <i class="material-icons tiny">remove_red_eye</i>
                                    <div class="newest-views"><?= 100?></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="b-item">
                            <div class="book-img">
                                <img src="<?= URL_IMG.'/logo/logo-sm.png'?>" alt="">
                            </div>
                            <div class="book-content">
                                <div class="book-title">
                                    <a href="http://">title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01</a></div>
                                <div class="newest-info video-post-info info-box">
                                    <i class="material-icons tiny">update</i>
                                    <div class="newest-date">  <?= 1?></div>
                                    <i class="material-icons tiny">remove_red_eye</i>
                                    <div class="newest-views"><?= 100?></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="b-item">
                            <div class="book-img">
                                <img src="<?= URL_IMG.'/logo/logo-sm.png'?>" alt="">
                            </div>
                            <div class="book-content">
                                <div class="book-title">
                                    <a href="http://">title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01title 01</a></div>
                                <div class="newest-info video-post-info info-box">
                                    <i class="material-icons tiny">update</i>
                                    <div class="newest-date">  <?= 1?></div>
                                    <i class="material-icons tiny">remove_red_eye</i>
                                    <div class="newest-views"><?= 100?></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            
            <!-- Indicators -->
            <?php 
                $args_banner = array(
                    'post_type' => 'postercategory',
                    'post_status' => 'publish',
                    'posts_per_page' => '10'
                );
                $list_img = new WP_Query( $args_banner );

            ?>
            <!-- The slideshow -->
            <?php
                if ( $list_img->have_posts() ) :
                    while ( $list_img->have_posts() ) : $list_img->the_post();
                    $title = get_the_title();
                    $tmp_img_link = get_field('upload_image');
                    $tmp_post_link = get_field('link_post');
            ?>
                <div class="slick-images">
                    <div class ="banner-item">
                        <div class="banner-title">
                            <a title="<?= $title;?>" target = "blank" href="<?= $tmp_post_link;?>"><?= $title;?></a>
                        </div>
                        <img src="<?= $tmp_img_link;?>" alt="<?= $title;?>">
                    </div>
            <?php
                    endwhile;
                    wp_reset_postdata();
            ?>
                </div>
            <?php
                endif;
            ?>
        </div>
    </div>
</section>
<?php
get_header();
?>
    <!-- content -->
    <div class="container">
        <!-- content banner  -->
        <?php get_template_part('template-part/banner'); ?>
        <!-- end content banner -->

        <!-- tin tức -->
        <?php get_template_part('template-part/top-news'); ?>
        <!-- end tin tức -->

        <!-- pháp âm  -->
        <section id ="section-radio">
            <div class="row row margin0-bottom box-title-left">
                <h2 class="color-a margin0 title-line-bottom">
                    <a class="title-header" href="http://">Pháp âm</a>
                </h2>
            </div>
            <div class="row">
                <?php echo do_shortcode('[videojs_video url="https://www.youtube.com/watch?v=Y4SSN9SvqSc"]');?>
            </div>
        </section>
        <!-- end pháp âm -->

        <!-- phật sự + thông báo -->
        <?php get_template_part('template-part/phatsu'); ?>
        <!-- end phật sự + thông báo -->

        <!-- Góc chia sẻ -->
        <section id ="section-radio">
            <div class="row row margin0-bottom box-title-left">
                <h2 class="color-a margin0 title-line-bottom">
                    <a class="title-header" href="http://">Góc chia sẻ</a>
                </h2>
            </div>
            <div class="row">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum delectus tempore provident dicta quidem, obcaecati, laboriosam at, veniam magnam placeat debitis ad eveniet laudantium corporis. Obcaecati voluptatum soluta odit facilis!
            </div>
        </section>
        <!-- end góc chia sẻ -->

        <!-- thư viện hình ảnh -->
        <section id ="section-radio">
            <div class="row row margin0-bottom box-title-left">
                <h2 class="color-a margin0 title-line-bottom">
                    <a class="title-header" href="http://">Thư viện hình ảnh</a>
                </h2>
            </div>
            <div class="row">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum delectus tempore provident dicta quidem, obcaecati, laboriosam at, veniam magnam placeat debitis ad eveniet laudantium corporis. Obcaecati voluptatum soluta odit facilis!
            </div>
        </section>
        <!-- end thư viện hình ảnh -->

        <!-- thư viện kinh sách -->
        <section id ="section-radio">
            <div class="row row margin0-bottom box-title-left">
                <h2 class="color-a margin0 title-line-bottom">
                    <a class="title-header" href="http://">Thư viện kinh sách</a>
                </h2>
            </div>
            <div class="row">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum delectus tempore provident dicta quidem, obcaecati, laboriosam at, veniam magnam placeat debitis ad eveniet laudantium corporis. Obcaecati voluptatum soluta odit facilis!
            </div>
        </section>
        <!-- end thư viện kinh sách -->

        <!-- thống kê truy cập -->
        <section id="section-statistical">
            <div class="row">
                <!-- <div class="col m4">Số lượt truy cập: </div>
                <div class="col m4">Số người online: </div>
                <div class="col m4"></div> -->
            </div>
        </section>
        <!-- end thống kê truy cập -->
    </div>
    
    <!-- end content -->
<?php
get_footer();
?>
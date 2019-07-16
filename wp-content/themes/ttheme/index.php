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
        <?php get_template_part('template-part/phapam'); ?>
        <!-- end pháp âm -->

        <!-- thư viện hình ảnh -->
         <?php get_template_part('template-part/lib-images'); ?>
        <!-- end thư viện hình ảnh -->

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

       

        <!-- thư viện kinh sách -->
        <?php get_template_part('template-part/lib-kinhsach'); ?>
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
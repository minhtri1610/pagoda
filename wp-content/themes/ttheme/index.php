<?php
get_header();
?>
    <!-- content -->
    <div class="index-body">
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
        <?php get_template_part('template-part/share'); ?>
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
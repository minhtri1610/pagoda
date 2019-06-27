<?php
get_header();
?>
    <!-- include navbar -->
    <?php get_template_part('template-part/navbar'); ?>
    <!-- content -->
    <div class="container">
        <section id = "banner">
            <div class="carousel carousel-slider center">
                <div class="carousel-fixed-item center">
                    <a class="btn waves-effect white grey-text darken-text-2">button</a>
                </div>
                <div class="carousel-item red white-text" href="#one!">
                    <h2>First Panel</h2>
                    <p class="white-text">This is your first panel</p>
                </div>
                <div class="carousel-item amber white-text" href="#two!">
                    <h2>Second Panel</h2>
                    <p class="white-text">This is your second panel</p>
                </div>
                <div class="carousel-item green white-text" href="#three!">
                    <h2>Third Panel</h2>
                    <p class="white-text">This is your third panel</p>
                </div>
                <div class="carousel-item blue white-text" href="#four!">
                    <h2>Fourth Panel</h2>
                    <p class="white-text">This is your fourth panel</p>
                </div>
            </div>
        </section>
        
        <!-- tin tức -->
        <section id = "section-news">
            <div class="row">
                <div class="col s12 m8">
                    <div class="row margin0-bottom box-title-left">
                        <h2 class=" title-line-bottom margin-bottom-right color-a margin0"><a class="title-header" href="<?= URL_ROOT?>">Tin mới</a></h2>
                    </div>
                    <div class="row margin0-bottom">
                        <div class="col m6 s12">
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img class="activator" src="<?= URL_IMG;?>/office.jpg">
                                </div>
                                <div class="card-content">
                                    <span class="card-title activator grey-text text-darken-4">Card Title<i class="material-icons right">more_vert</i></span>
                                    <p><a href="#">This is a link</a></p>
                                </div>
                                <div class="card-reveal">
                                    <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
                                    <p>Here is some more information about this product that is only revealed once clicked on.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col m6 s12">
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img class="activator" src="<?= URL_IMG;?>/office.jpg">
                                </div>
                                <div class="card-content">
                                    <span class="card-title activator grey-text text-darken-4">Card Title<i class="material-icons right">more_vert</i></span>
                                    <p><a href="#">This is a link</a></p>
                                </div>
                                <div class="card-reveal">
                                    <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
                                    <p>Here is some more information about this product that is only revealed once clicked on.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col m6 s12">
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img class="activator" src="<?= URL_IMG;?>/office.jpg">
                                </div>
                                <div class="card-content">
                                    <span class="card-title activator grey-text text-darken-4">Card Title<i class="material-icons right">more_vert</i></span>
                                    <p><a href="#">This is a link</a></p>
                                </div>
                                <div class="card-reveal">
                                    <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
                                    <p>Here is some more information about this product that is only revealed once clicked on.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col m6 s12">
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img class="activator" src="<?= URL_IMG;?>/office.jpg">
                                </div>
                                <div class="card-content">
                                    <span class="card-title activator grey-text text-darken-4">Card Title<i class="material-icons right">more_vert</i></span>
                                    <p><a href="#">This is a link</a></p>
                                </div>
                                <div class="card-reveal">
                                    <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
                                    <p>Here is some more information about this product that is only revealed once clicked on.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col s4">
                    <div class="row ">
                        <h2 class="color-a margin0 title-line-bottom "><a class="title-header" href="<?= URL_ROOT?>">Fanpage facebook</a></h2>
                    </div>
                    <div class="row">
                        Content fanpage facebook
                    </div>
                
                </div>
            </div>
        </section>
        <!-- end tin tức -->

        <!-- pháp âm  -->
        <section id ="section-radio">
            <div class="row row margin0-bottom box-title-left">
                <h2 class="color-a margin0 title-line-bottom">
                    <a class="title-header" href="http://">Pháp âm</a>
                </h2>
            </div>
            <div class="row">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsum delectus tempore provident dicta quidem, obcaecati, laboriosam at, veniam magnam placeat debitis ad eveniet laudantium corporis. Obcaecati voluptatum soluta odit facilis!
            </div>
        </section>
        <!-- end pháp âm -->

        <!-- phật sự + thông báo -->
        <section id = "section-news">
            <div class="row">
                <div class="col s12 m8">
                    <div class="row margin0-bottom box-title-left">
                        <h2 class=" title-line-bottom margin-bottom-right color-a margin0"><a class="title-header" href="<?= URL_ROOT?>">Phật sự</a></h2>
                    </div>
                    <div class="row margin0-bottom">
                        <div class="col m6 s12">
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img class="activator" src="<?= URL_IMG;?>/office.jpg">
                                </div>
                                <div class="card-content">
                                    <span class="card-title activator grey-text text-darken-4">Card Title<i class="material-icons right">more_vert</i></span>
                                    <p><a href="#">This is a link</a></p>
                                </div>
                                <div class="card-reveal">
                                    <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
                                    <p>Here is some more information about this product that is only revealed once clicked on.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col m6 s12">
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img class="activator" src="<?= URL_IMG;?>/office.jpg">
                                </div>
                                <div class="card-content">
                                    <span class="card-title activator grey-text text-darken-4">Card Title<i class="material-icons right">more_vert</i></span>
                                    <p><a href="#">This is a link</a></p>
                                </div>
                                <div class="card-reveal">
                                    <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
                                    <p>Here is some more information about this product that is only revealed once clicked on.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col m6 s12">
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img class="activator" src="<?= URL_IMG;?>/office.jpg">
                                </div>
                                <div class="card-content">
                                    <span class="card-title activator grey-text text-darken-4">Card Title<i class="material-icons right">more_vert</i></span>
                                    <p><a href="#">This is a link</a></p>
                                </div>
                                <div class="card-reveal">
                                    <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
                                    <p>Here is some more information about this product that is only revealed once clicked on.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col m6 s12">
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img class="activator" src="<?= URL_IMG;?>/office.jpg">
                                </div>
                                <div class="card-content">
                                    <span class="card-title activator grey-text text-darken-4">Card Title<i class="material-icons right">more_vert</i></span>
                                    <p><a href="#">This is a link</a></p>
                                </div>
                                <div class="card-reveal">
                                    <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
                                    <p>Here is some more information about this product that is only revealed once clicked on.</p>
                                </div>
                            </div>
                        </div>
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
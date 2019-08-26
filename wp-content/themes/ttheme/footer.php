    <div class="content-social">
        <div class="list-social">
            <div class="item-social">
                <img src="<?= URL_IMG.'/icon-social/facebook.png'?>" alt="">
            </div>
            <div class="item-social">
                <img src="<?= URL_IMG.'/icon-social/zalo.png'?>" alt="">
            </div>
        </div>
    </div>
    <footer class="page-footer">
        <div class="container main-footer">
            <div class="row">
                <div class="col-md-6 f-info">
                    <h5 class="white-text name-title">
                        <a href="<?= THEME_URL?>">Chùa Phước Lộc</a></h5>
                    <p class="mb0">Địa chỉ: Mỹ Cát - Phù Mỹ - Bình Định</p>
                    <p class="mb0">Email: chuaphuocloc@gmail.com</p>
                </div>
                <div class="col-md-6">
                    <h5 class="white-text">Fanpage</h5>
                    
                </div>
            </div> 
        </div>
        <div class="text-center">
            <div class="text-copyr">
                © 2019 Copyright by chuaphuocloc.com
            </div>
        </div>
    </footer>
    
    <script type="text/javascript" src="<?= URL_JS.'/jquery-11.0.min.js'?>"></script>
    <script type="text/javascript" src="<?= URL_JS.'/bootstrap.min.js'?>"></script>
    <script type="text/javascript" src="<?= URL_JS.'/slick/slick.min.js'?>"></script>
    <script type="text/javascript" src="<?= URL_JS.'/index.js'?>"></script>
    <script>
        jQuery(document).ready(function($) {
            $('.slick-banner').slick({
                infinite: true,
                dots: true,
                // autoplay: true,
                // autoplaySpeed: 3000,
            });
            $('.slick-books').slick({
                infinite: true,
                dots: true,
                slidesToShow: 3,
                slidesToScroll: 1
                // autoplay: true,
                // autoplaySpeed: 3000,
            });
            $('.slick-images').slick({
                infinite: true,
                dots: true,
                slidesToShow: 3,
                slidesToScroll: 1
                // autoplay: true,
                // autoplaySpeed: 3000,
            });
            $('.slick-banner').show();
            // $('.slick-books').show();
            // $('.slick-images').show();
        });
    </script>
    <?php wp_footer(); ?>
</body>
</html>
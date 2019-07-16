    
    <footer class="page-footer">

        <div class="container">
            <div class="row">
                <div class="col l6 s12">
                    <h5 class="white-text">Chùa Phước Lộc</h5>
                    <p class="grey-text text-lighten-4">Địa chỉ: Mỹ Cát - Phù Mỹ - Bình Định</p>
                </div>
                <div class="col l4 offset-l2 s12">
                    <h5 class="white-text">Links</h5>
                    <ul>
                        <li><a class="grey-text text-lighten-3" href="#!">Link 1</a></li>
                        <li><a class="grey-text text-lighten-3" href="#!">Link 2</a></li>
                        <li><a class="grey-text text-lighten-3" href="#!">Link 3</a></li>
                        <li><a class="grey-text text-lighten-3" href="#!">Link 4</a></li>
                    </ul>
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
        });
    </script>
    <?php wp_footer(); ?>
</body>
</html>
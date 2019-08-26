
<?php
    $pagename = get_query_var('pagename');
    $str_page_name = getPageName($pagename);
?>
<section id="poster">
    
    <?php 
        $args_caudoi = array(
            'post_type' => 'caudoi',
            'post_status' => 'publish',
            'posts_per_page' => '1',
            'category_name ' => $pagename
        );
        $obj_caudoi = new WP_Query( $args_caudoi );
    ?>
    <?php
        if ( $obj_caudoi->have_posts() ) :
            while ( $obj_caudoi->have_posts() ) : $obj_caudoi->the_post();
            $caudoi_content = get_the_content();
    ?>
    <div class="container contain-caudoi">
        <?= nl2br($caudoi_content);?>
    </div>
    <?php
            endwhile;
        wp_reset_postdata();
        endif;
    ?>
</section>
<section id='sub-nav'>
    <div class="container">
        <ul>
            <li><a href="<?= URL_ROOT;?>"><?= __('Trang chủ')?></a></li>
            <li><a href="<?= URL_ROOT;?>"> &#8811; </a></li>
            <li><a href="<?= URL_ROOT."/$pagename";?>"><?= $str_page_name;?></a></li>
        </ul>
    </div>
</section>

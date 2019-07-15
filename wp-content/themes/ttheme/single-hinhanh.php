<?php get_header(); ?>

<main role="main">
    <div class="container">
        <div class="row">
        
            <?php
                while ( have_posts() ) : the_post(); 
                $id_post = get_the_ID();
                $title_mcc = get_the_title();
                $link_mcc = get_the_permalink();
                $description_mcc = get_the_content();
                $date_post = get_the_date();
                
            ?>
            <!-- <?= $description_mcc?> -->
            <!-- <?= do_shortcode('[envira-gallery id="108"]');?> -->
            <div class="content">
                <?php echo  nl2br(do_shortcode($description_mcc));?>
            </div>
            <?php
                    
                endwhile;
            ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>
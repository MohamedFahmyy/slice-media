<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Services
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->string('featured_image')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->json('deliverables')->nullable();
            $table->json('process')->nullable();
            $table->string('duration_en')->nullable();
            $table->string('duration_ar')->nullable();
            $table->string('cta_label_en')->nullable();
            $table->string('cta_label_ar')->nullable();
            $table->string('cta_link')->nullable();
            $table->timestamps();

            $table->index(['is_visible', 'order']);
        });

        Schema::create('service_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $table->string('locale', 5);
            $table->string('title');
            $table->text('description');
            $table->longText('details')->nullable();
            $table->timestamps();

            $table->unique(['service_id', 'locale']);
        });

        // 2. Portfolio Projects
        Schema::create('portfolio_projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('client_name');
            $table->string('industry')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->string('featured_image')->nullable();
            $table->json('gallery')->nullable();
            $table->timestamps();

            $table->index(['is_published', 'is_featured', 'order']);
        });

        Schema::create('portfolio_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_project_id')->constrained('portfolio_projects')->cascadeOnDelete();
            $table->string('locale', 5);
            $table->string('title');
            $table->text('summary');
            $table->text('challenge')->nullable();
            $table->text('strategy')->nullable();
            $table->text('execution')->nullable();
            $table->text('outcomes')->nullable();
            $table->timestamps();

            $table->unique(['portfolio_project_id', 'locale']);
        });

        // 3. Videos (3D Video Strip / Content Formats Showcase)
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->enum('provider', ['vimeo', 'youtube', 'self_hosted'])->default('vimeo');
            $table->string('provider_id')->nullable(); // e.g. Vimeo ID '1195094508'
            $table->string('external_url')->nullable();
            $table->string('video_path')->nullable();
            $table->string('thumbnail_path')->nullable();
            $table->string('aspect_ratio')->default('9:16');
            $table->string('duration')->nullable();
            $table->string('category')->nullable();
            $table->string('format_type')->nullable(); // storytelling, skits, voxpop, ugc
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_featured')->default(true);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['is_published', 'order']);
        });

        Schema::create('video_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained('videos')->cascadeOnDelete();
            $table->string('locale', 5);
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('tagline')->nullable();
            $table->string('badge')->nullable();
            $table->timestamps();

            $table->unique(['video_id', 'locale']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_translations');
        Schema::dropIfExists('videos');
        Schema::dropIfExists('portfolio_translations');
        Schema::dropIfExists('portfolio_projects');
        Schema::dropIfExists('service_translations');
        Schema::dropIfExists('services');
    }
};

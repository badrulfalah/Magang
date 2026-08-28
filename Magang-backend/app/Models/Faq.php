<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Faq extends Model
{
    protected $table = 'faq';

    protected $primaryKey = 'id_faq';

    public $timestamps = false;

    protected $fillable = [
        'dibuat_oleh',
        'pertanyaan',
        'jawaban',
        'urutan',
    ];

    protected $casts = [
        'urutan' => 'integer',
    ];

    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh', 'id');
    }
}

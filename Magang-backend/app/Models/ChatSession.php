<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    use HasFactory;

    protected $table = 'chat_sessions';

    protected $fillable = [
        'customer_id',
        'product_id',
        'marketing_id',
        'status',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function marketing()
    {
        return $this->belongsTo(User::class, 'marketing_id');
    }

    public function product()
    {
        return $this->belongsTo(Produk::class, 'product_id', 'id_produk');
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'chat_session_id');
    }

    public function files()
    {
        return $this->hasMany(ChatFile::class, 'chat_session_id');
    }
}

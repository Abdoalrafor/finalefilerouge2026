<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // إنشاء مدير
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@school.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+212600000000',
            'address' => 'Admin Address',
        ]);

        // إنشاء معلم
        User::create([
            'name' => 'Teacher User',
            'email' => 'teacher@school.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'phone' => '+212611111111',
            'address' => 'Teacher Address',
        ]);

        // إنشاء طالب
        User::create([
            'name' => 'Student User',
            'email' => 'student@school.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'phone' => '+212622222222',
            'address' => 'Student Address',
            'date_of_birth' => '2005-01-01',
        ]);

        // إنشاء ولي أمر
        User::create([
            'name' => 'Parent User',
            'email' => 'parent@school.com',
            'password' => Hash::make('password'),
            'role' => 'parent',
            'phone' => '+212633333333',
            'address' => 'Parent Address',
        ]);
    }
}
# Generated by Django 5.1.3 on 2024-12-14 10:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('client', '0003_rename_company_flyer_name_remove_identity_company'),
    ]

    operations = [
        migrations.RenameField(
            model_name='identity',
            old_name='number',
            new_name='id_number',
        ),
    ]

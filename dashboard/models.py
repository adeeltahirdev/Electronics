from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class AdminLog(models.Model):
    ACTION_TYPES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('view', 'View'),
    ]
    
    admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=20, choices=ACTION_TYPES)
    model_name = models.CharField(max_length=100)
    object_id = models.IntegerField(null=True, blank=True)
    details = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        admin_name = self.admin.username if self.admin else 'System'
        return f"{admin_name} - {self.action} - {self.model_name} at {self.created_at}"

class DashboardSettings(models.Model):
    site_name = models.CharField(max_length=200, default='Vision Electronics')
    site_logo = models.ImageField(upload_to='settings/', blank=True, null=True)
    currency = models.CharField(max_length=10, default='Rs')
    low_stock_threshold = models.IntegerField(default=10)
    enable_notifications = models.BooleanField(default=True)
    order_status_notification = models.BooleanField(default=True)
    
    def __str__(self):
        return self.site_name
    
    class Meta:
        verbose_name_plural = "Dashboard Settings"